
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
  {admin ? (
    /* ADMIN DASHBOARD */
    <div className="space-y-8">
      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-400">
              <ShieldCheck size={18} />
              ADMINISTRATION CONSOLE
            </div>

            <h1 className="text-3xl font-black sm:text-4xl">
              Inventory Control
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Manage dealership vehicles, monitor stock levels,
              and keep your inventory up to date.
            </p>
          </div>

          <button className="btn" onClick={() => open()}>
            <Plus size={18} />
            Add New Vehicle
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black">Inventory Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Summary of the vehicles returned by your current inventory filters.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            {
              label: "Vehicle Models",
              value: vehicles.length,
              icon: CarFront,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Units in Stock",
              value: stats.units,
              icon: Boxes,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Inventory Value",
              value: money(stats.value),
              icon: CheckCircle2,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Out of Stock",
              value: stats.out,
              icon: AlertCircle,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${item.bg} ${item.color}`}
                >
                  <Icon size={21} />
                </div>

                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 break-words text-2xl font-black text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-black">Vehicle Management</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, update, restock, or remove vehicles.
            </p>
          </div>

          <button className="secondary" onClick={load}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50 p-5 md:grid-cols-[1fr_190px_170px]">
          <label className="relative">
            <Search
              size={17}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              className="field pl-9"
              placeholder="Search make or model..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <select
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {[...new Set(vehicles.map((v) => v.category))].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="field"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          >
            <option value="all">All stock statuses</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-bold">Vehicle</th>
                <th className="px-5 py-4 font-bold">Category</th>
                <th className="px-5 py-4 font-bold">Price</th>
                <th className="px-5 py-4 font-bold">Quantity</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                        <CarFront size={23} />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {v.make} {v.model}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Inventory ID #{v.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {v.category}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900">
                    {money(v.price)}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {v.quantity}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        v.quantity > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {v.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="secondary"
                        title="Restock vehicle"
                        onClick={() => restock(v)}
                      >
                        <Plus size={15} />
                        Restock
                      </button>

                      <button
                        type="button"
                        className="secondary"
                        title="Edit vehicle"
                        onClick={() => open(v)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        className="secondary text-rose-600"
                        title="Delete vehicle"
                        onClick={() => remove(v)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {vehicles.length === 0 && (
            <div className="p-12 text-center">
              <CarFront className="mx-auto mb-3 text-slate-400" size={36} />
              <p className="font-bold text-slate-700">No vehicles found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
          Showing {vehicles.length} vehicle records
        </div>
      </section>
    </div>
  ) : (
    /* CUSTOMER SHOWROOM */
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            Explore our collection
          </p>
          <h1 className="text-3xl font-black sm:text-4xl">
            Find your next car.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse available vehicles and purchase directly.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_190px_170px]">
        <label className="relative">
          <Search
            size={17}
            className="absolute left-3 top-3.5 text-slate-400"
          />
          <input
            className="field pl-9"
            placeholder="Search make or model..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        <select
          className="field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {[...new Set(vehicles.map((v) => v.category))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="field"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        >
          <option value="all">All vehicles</option>
          <option value="in">In stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((v) => (
          <article
            key={v.id}
            className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative grid h-32 place-items-center bg-gradient-to-br from-orange-100 to-slate-100">
              <CarFront size={78} strokeWidth={1.2} />

              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold">
                {v.category}
              </span>

              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                  v.quantity
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {v.quantity ? `${v.quantity} available` : "Out of stock"}
              </span>
            </div>

            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {v.make}
              </p>

              <div className="mt-1 flex items-start justify-between gap-3">
                <h2 className="text-xl font-black">{v.model}</h2>
                <span className="font-black text-orange-600">
                  {money(v.price)}
                </span>
              </div>

              <p className="my-4 border-t pt-3 text-xs text-slate-500">
                Vehicle ID #{v.id}
              </p>

              <button
                type="button"
                disabled={!v.quantity}
                className="btn w-full disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => buy(v)}
              >
                {v.quantity ? "Purchase Vehicle" : "Currently Unavailable"}
                <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center text-slate-500">
          <Search className="mx-auto mb-3" size={30} />
          <p className="font-bold">No vehicles found</p>
          <p className="mt-1 text-sm">Try another search or filter.</p>
        </div>
      )}
    </div>
  )}


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
