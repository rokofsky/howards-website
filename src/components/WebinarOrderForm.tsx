import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface OrderFormProps {
  sessionId?: string;
  availableDates: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export const WebinarOrderForm = ({ sessionId, availableDates, onClose, onSuccess }: OrderFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return alert('Please select a date option');
    setLoading(true);

    const { error } = await supabase
      .from('webinar_orders')
      .insert([
        { 
          session_id: sessionId, 
          customer_name: name, 
          customer_email: email, 
          chosen_date: selectedDate 
        }
      ]);

    setLoading(false);
    if (error) {
      alert('Order failed: ' + error.message);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full text-black">
        <h2 className="text-xl font-bold mb-4">Place Non-Binding Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded bg-white text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded bg-white text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <select required value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border p-2 rounded bg-white text-black">
              <option value="">-- Choose a date --</option>
              <option value="Undecided">Undecided (Decide later)</option>
              {availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {loading ? 'Processing...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
