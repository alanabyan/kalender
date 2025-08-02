"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";

const locales = { id };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });
const ArrowIcon = ({ direction = "left" }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${direction === "right" && "transform rotate-180"}`}><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>);

export default function KalenderPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", date: "", startTime: "08:00", endTime: "09:00" });
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date());
  const [active, setActive] = useState('Jadwal');
  const router = useRouter();

  const API_URL = "http://localhost:3333/api/kalender";

  const menuItems = [
    'Beranda', 'Kelas', 'Materi', 'Ujian', 'Postingan', 'Jadwal', 'Konsultasi', 'Kolaborasi', 'Perpustakaan', 'Tata tertib'
  ];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return router.push('/login');

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            router.push('/login');
          }
          throw new Error('Gagal mengambil data.');
        }
        const data = await response.json();
        const formattedEvents = data.events.map((event, index) => {
          console.log(`Processing event ${index}:`, event); // ⬅️ Cek setiap event satu per satu
          return {
            id: event.id,
            title: event.nama,
            start: new Date(`${event.tanggal_mulai?.substring(0, 10)}T${event.waktu_mulai}`),
            end: new Date(`${event.tanggal_akhir?.substring(0, 10)}T${event.waktu_akhir}`),
            labelColor: "#3182ce"
          };
        });
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        start: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
        end: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
      })
    });
    if (response.ok) {
      const addedEvent = await response.json();
      setEvents(prev => [...prev, {
        id: addedEvent.eventId,
        title: formData.title,
        description: formData.description,
        start: new Date(`${formData.date}T${formData.startTime}`),
        end: new Date(`${formData.date}T${formData.endTime}`),
        labelColor: "#3182ce"
      }]);
      setIsFormOpen(false);
      setFormData({ title: "", description: "", date: "", startTime: "08:00", endTime: "09:00" });
    } else {
      setError("Gagal menambahkan jadwal.");
    }
  };

  const handleNavigate = useCallback((newDate) => setDate(newDate), []);
  const goToPreviousMonth = () => handleNavigate(new Date(date.setMonth(date.getMonth() - 1)));
  const goToNextMonth = () => handleNavigate(new Date(date.setMonth(date.getMonth() + 1)));

  if (loading) return <div className="text-center mt-12">Memuat...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="flex justify-center items-center bg-gradient-to-r py-9 from-[#267FEA] to-[#3146BB] shadow-md ">
        <ul className="flex justify-center items-center gap-x-6">
          {menuItems.map((item) => (
            <li key={item} className={`cursor-pointer font-bold text-sm md:text-base transition-colors duration-200 ${active === item ? 'text-white' : 'text-[#99B1E8] hover:text-white'}`} onClick={() => setActive(item)}>{item}</li>
          ))}
        </ul>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPreviousMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition"><ArrowIcon direction="left" /></button>
          <h2 className="text-2xl font-bold text-gray-800">{format(date, "MMMM yyyy", { locale: id })}</h2>
          <button onClick={goToNextMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition"><ArrowIcon direction="right" /></button>
        </div>
        <div className="h-[80vh] bg-white p-4 rounded-lg shadow">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="id"
            date={date}
            onNavigate={handleNavigate}
            toolbar={false}
            eventPropGetter={(event) => {
              const backgroundColor = event.labelColor || "#3182ce";
              return {
                style: {
                  backgroundColor,
                  color: "#000",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontWeight: "bold",
                }
              };
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen ? (
          <motion.div layoutId="form-container" className="fixed bottom-10 right-10 bg-white p-6 rounded-lg shadow-2xl w-[400px] z-50" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
              <h3 className="text-xl font-bold mb-4">Tambah Jadwal Baru</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Nama Kegiatan" className="w-full p-2 border border-gray-300 rounded-md" />
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi (opsional)" className="w-full p-2 border border-gray-300 rounded-md" />
                <div className="flex gap-2 flex-wrap">
                  <input name="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="p-2 border border-gray-300 rounded-md flex-grow min-w-[150px]" />
                  <input name="startTime" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="p-2 border border-gray-300 rounded-md" />
                  <input name="endTime" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="p-2 border border-gray-300 rounded-md" />
                </div>
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan Jadwal</button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </form>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button layoutId="form-container" onClick={() => setIsFormOpen(true)} className="fixed bottom-10 right-10 w-12 h-12 bg-blue-600 text-white rounded-full flex justify-center text-4xl shadow-lg hover:bg-blue-700 transition-colors z-50" title="Tambah Jadwal Baru">+</motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
