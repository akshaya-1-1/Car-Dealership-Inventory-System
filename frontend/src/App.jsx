
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CarFront,
  Search,
  Plus,
  LogOut,
  ShieldCheck,
  Boxes,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Mail,
  KeyRound,
  SlidersHorizontal
} from 'lucide-react';
import { api } from './api';

const blank = {
  make: '',
  model: '',
  category: 'Sedan',
  price: '',
  quantity: '1'
};

const money = n =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(n);

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem('mh_token') || ''
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('mh_user') || 'null')
  );

  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [stock, setStock] = useState('all');
  const [notice, setNotice] = useState('');
  const [bad, setBad] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [vf, setVf] = useState(blank);
  const [busy, setBusy] = useState(false);

  const admin = user?.role === 'admin';

  const categories = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Coupe',
    'Truck',
    'Electric',
    'Other'
  ];

  const flash = (message, isError = false) => {
    setNotice(message);
    setBad(isError);
    setTimeout(() => setNotice(''), 3500);
  };

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (q.trim()) {
        params.set('q', q.trim());
      }

      if (category !== 'All') {
        params.set('category', category);
      }

      if (stock === 'in') {
        params.set('in_stock', 'true');
      }

      if (stock === 'out') {
        params.set('in_stock', 'false');
      }

      const query = params.toString();

      const data = await api(
        '/vehicles' + (query ? `?${query}` : '')
      );

      setVehicles(data);
    } catch (error) {
      flash(error.message, true);
    }
  }, [q, category, stock]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => ({
      units: vehicles.reduce(
        (sum, vehicle) => sum + vehicle.quantity,
        0
      ),
      value: vehicles.reduce(
        (sum, vehicle) => sum + vehicle.quantity * vehicle.price,
        0
      ),
      out: vehicles.filter(vehicle => !vehicle.quantity).length
    }),
    [vehicles]
  );

  async function auth(e) {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === 'register') {
        await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify(form)
        });

        setMode('login');
        flash('Account created. Please sign in.');
      } else {
        const result = await api('/auth/login', {
          method: 'POST',
          body: JSON.stringify(form)
        });

        const currentUser = await api('/auth/me', {
          token: result.access_token
        });

        localStorage.setItem('mh_token', result.access_token);
        localStorage.setItem(
          'mh_user',
          JSON.stringify(currentUser)
        );

        setToken(result.access_token);
        setUser(currentUser);

        flash('Welcome, ' + currentUser.full_name);
      }
    } catch (error) {
      flash(error.message, true);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem('mh_token');
    localStorage.removeItem('mh_user');

    setToken('');
    setUser(null);
  }

  function open(vehicle = null) {
    setEditing(vehicle?.id || null);

    setVf(
      vehicle
        ? {
            make: vehicle.make,
            model: vehicle.model,
            category: vehicle.category,
            price: String(vehicle.price),
            quantity: String(vehicle.quantity)
          }
        : { ...blank }
    );

    setModal(true);
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);

    try {
      await api(
        editing ? `/vehicles/${editing}` : '/vehicles',
        {
          method: editing ? 'PUT' : 'POST',
          token,
          body: JSON.stringify({
            ...vf,
            price: Number(vf.price),
            quantity: Number(vf.quantity)
          })
        }
      );

      setModal(false);
      flash(editing ? 'Vehicle updated' : 'Vehicle added');
      await load();
    } catch (error) {
      flash(error.message, true);
    } finally {
      setBusy(false);
    }
  }

  async function buy(vehicle) {
    try {
      const result = await api(
        `/vehicles/${vehicle.id}/purchase`,
        {
          method: 'POST',
          token
        }
      );

      flash(
        `${result.message}. Remaining stock: ${result.quantity_remaining}`
      );

      await load();
    } catch (error) {
      flash(error.message, true);
    }
  }

  async function restock(vehicle) {
    const quantity = Number(
      prompt('Units to add:', '1')
    );

    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    try {
      await api(`/vehicles/${vehicle.id}/restock`, {
        method: 'POST',
        token,
        body: JSON.stringify({ quantity })
      });

      flash('Stock updated');
      await load();
    } catch (error) {
      flash(error.message, true);
    }
  }

  async function remove(vehicle) {
    if (!confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) {
      return;
    }

    try {
      await api(`/vehicles/${vehicle.id}`, {
        method: 'DELETE',
        token
      });

      flash('Vehicle deleted');
      await load();
    } catch (error) {
      flash(error.message, true);
    }
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-white">
        <aside className="hidden lg:flex flex-col justify-between bg-ink p-14 text-white">
          <div className="flex gap-3 text-xl font-black">
            <CarFront className="text-orange-400" />
            motorhub
          </div>

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-400">
              The smarter showroom
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Your next great drive starts here.
            </h1>

            <p className="mt-5 text-slate-300">
              Explore inventory and manage your dealership from one place.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            MotorHub Inventory Studio
          </p>
        </aside>

        <main className="flex items-center justify-center p-6">
          <form onSubmit={auth} className="w-full max-w-md">
            <div className="mb-8 flex gap-2 text-xl font-black">
              <CarFront className="text-orange-500" />
              motorhub
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              {mode === 'login' ? 'Welcome back' : 'Join MotorHub'}
            </p>

            <h2 className="my-3 text-3xl font-black">
              {mode === 'login'
                ? 'Sign in to your account'
                : 'Create your account'}
            </h2>

            {mode === 'register' && (
              <input
                className="field mb-3"
                placeholder="Full name"
                required
                value={form.full_name}
                onChange={e =>
                  setForm({
                    ...form,
                    full_name: e.target.value
                  })
                }
              />
            )}

            <label className="mb-3 block text-sm font-semibold">
              <Mail size={15} className="inline mr-2" />
              Email

              <input
                className="field mt-2"
                type="email"
                required
                value={form.email}
                onChange={e =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
              />
            </label>

            <label className="mb-2 block text-sm font-semibold">
              <KeyRound size={15} className="inline mr-2" />
              Password

              <input
                className="field mt-2"
                type="password"
                minLength={mode === 'register' ? 8 : 1}
                maxLength={128}
                pattern={
                  mode === 'register'
                    ? '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,128}'
                    : undefined
                }
                title="Use 8–128 characters, including uppercase and lowercase letters, a number, and a special character."
                required
                value={form.password}
                onChange={e =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
              />

              {mode === 'register' && (
                <p className="mt-2 text-xs font-normal leading-5 text-slate-500">
                  Password requirements:
                  <br />
                  • 8–128 characters
                  <br />
                  • At least one uppercase letter and one lowercase letter
                  <br />
                  • At least one number
                  <br />
                  • At least one special character (such as @, #, or !)
                </p>
              )}
            </label>

            <button className="btn w-full" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}

              <ArrowRight size={16} />
            </button>

            <p className="mt-5 text-center text-sm text-slate-500">
              {mode === 'login'
                ? 'New here?'
                : 'Already registered?'}{' '}

              <button
                type="button"
                className="font-bold text-orange-600"
                onClick={() =>
                  setMode(
                    mode === 'login' ? 'register' : 'login'
                  )
                }
              >
                {mode === 'login' ? 'Create account' : 'Sign in'}
              </button>
            </p>

            {notice && (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
                {notice}
              </p>
            )}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-ink p-2 text-white">
              <CarFront />
            </span>

            <b className="text-lg">
              motor<span className="text-orange-500">hub</span>
            </b>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <b className="block text-sm">{user.full_name}</b>
              <small>
                {admin ? 'Administrator' : 'Customer'}
              </small>
            </span>

            <button className="secondary" onClick={logout}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-600">
              Dealership overview
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              Inventory at a glance.
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Find vehicles and keep stock up to date.
            </p>
          </div>

          {admin && (
            <button className="btn" onClick={() => open()}>
              <Plus size={17} />
              Add vehicle
            </button>
          )}
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Vehicle models', vehicles.length],
            ['Units in stock', stats.units],
            ['Stock value', money(stats.value)],
            ['Out of stock', stats.out]
          ].map(([label, value]) => (
            <div
              className="rounded-2xl border bg-white p-5"
              key={label}
            >
              <div className="mb-4 flex gap-2 text-xs font-semibold text-slate-500">
                <Boxes size={17} />
                {label}
              </div>

              <p className="text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border bg-white p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">
                Showroom inventory
              </h2>

              <p className="text-sm text-slate-500">
                {vehicles.length} listings
              </p>
            </div>

            <button className="secondary" onClick={load}>
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-[1fr_190px_170px]">
            <label className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                className="field pl-9"
                placeholder="Search make or model…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </label>

            {/* FIXED: Keep all category choices available */}
            <label className="relative">
              <SlidersHorizontal
                size={15}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <select
                className="field pl-9"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>

                {categories.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <select
              className="field"
              value={stock}
              onChange={e => setStock(e.target.value)}
            >
              <option value="all">All stock status</option>
              <option value="in">In stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>

          {!vehicles.length ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-slate-500">
              <Search className="mx-auto mb-3" />

              <b>No vehicles found</b>

              <p className="text-sm">
                Try another search or filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map(vehicle => (
                <article
                  key={vehicle.id}
                  className="overflow-hidden rounded-2xl border hover:shadow-lg"
                >
                  <div className="relative grid h-32 place-items-center bg-gradient-to-br from-orange-100 to-slate-100">
                    <CarFront size={84} strokeWidth={1.1} />

                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold">
                      {vehicle.category}
                    </span>

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                        vehicle.quantity
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {vehicle.quantity
                        ? `${vehicle.quantity} available`
                        : 'Out of stock'}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {vehicle.make}
                    </p>

                    <div className="mt-1 flex justify-between gap-2">
                      <h3 className="text-lg font-black">
                        {vehicle.model}
                      </h3>

                      <b>{money(vehicle.price)}</b>
                    </div>

                    <p className="my-4 border-t pt-3 text-xs text-slate-500">
                      Inventory ID #{vehicle.id} · {vehicle.quantity} units
                    </p>

                    {admin ? (
                      <div className="flex gap-2">
                        <button
                          className="secondary flex-1"
                          onClick={() => restock(vehicle)}
                        >
                          <Plus size={15} />
                          Stock
                        </button>

                        <button
                          className="secondary flex-1"
                          onClick={() => open(vehicle)}
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          className="secondary"
                          aria-label="Delete vehicle"
                          onClick={() => remove(vehicle)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!vehicle.quantity}
                        className="btn w-full"
                        onClick={() => buy(vehicle)}
                      >
                        {vehicle.quantity
                          ? 'Purchase vehicle'
                          : 'Currently unavailable'}

                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="flex justify-between py-6 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} MotorHub</span>

          <span className="flex gap-1">
            <ShieldCheck size={13} />
            Role-based access
          </span>
        </footer>
      </main>

      {notice && (
        <div
          className={`fixed bottom-5 right-5 z-30 flex max-w-sm items-center gap-2 rounded-xl border bg-white p-4 shadow-xl ${
            bad ? 'text-rose-700' : 'text-emerald-700'
          }`}
        >
          {bad ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}

          <span className="text-sm font-semibold">{notice}</span>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex justify-between">
              <h2 className="text-2xl font-black">
                {editing ? 'Edit vehicle' : 'Add vehicle'}
              </h2>

              <button
                type="button"
                className="secondary"
                onClick={() => setModal(false)}
              >
                Close
              </button>
            </div>

            {[
              ['make', 'Make'],
              ['model', 'Model'],
              ['category', 'Category'],
              ['price', 'Price (USD)'],
              ['quantity', 'Quantity']
            ].map(([key, label]) => (
              <label
                key={key}
                className="block text-sm font-semibold"
              >
                {label}

                {key === 'category' ? (
                  <select
                    className="field mt-2"
                    value={vf[key]}
                    onChange={e =>
                      setVf({
                        ...vf,
                        [key]: e.target.value
                      })
                    }
                  >
                    {categories.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="field mt-2"
                    required
                    type={
                      ['price', 'quantity'].includes(key)
                        ? 'number'
                        : 'text'
                    }
                    min={
                      key === 'price'
                        ? '0.01'
                        : key === 'quantity'
                          ? '0'
                          : undefined
                    }
                    step={
                      key === 'price'
                        ? '0.01'
                        : key === 'quantity'
                          ? '1'
                          : undefined
                    }
                    value={vf[key]}
                    onChange={e =>
                      setVf({
                        ...vf,
                        [key]: e.target.value
                      })
                    }
                  />
                )}
              </label>
            ))}

            <button className="btn w-full" disabled={busy}>
              {busy
                ? 'Saving…'
                : editing
                  ? 'Save changes'
                  : 'Add vehicle'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
