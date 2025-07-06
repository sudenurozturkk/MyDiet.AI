import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
}

export default function ProgressChart({ data }: { data: ProgressData[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-primary">Kilo ve Yağ Oranı Grafiği</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ color: '#1E90FF' }} />
          <Line type="monotone" dataKey="weight" stroke="#1E90FF" name="Kilo (kg)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          <Line type="monotone" dataKey="bodyFat" stroke="#32CD32" name="Yağ Oranı (%)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 