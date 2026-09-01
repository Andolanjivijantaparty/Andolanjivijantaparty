import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    Eye,
    Image as ImageIcon,
    Images,
    Inbox,
    Loader2,
    LogOut,
    Mail,
    Megaphone,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

const imageUrl = (record) => (record?.image ? pb.files.getURL(record, record.image) : '');

const fmtDate = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/* ------------------------------- Notice -------------------------------- */

const EMPTY_NOTICE = { title: '', date: '', tag: '', description: '', image: null };

function NoticeManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_NOTICE);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const list = await pb.collection('news').getFullList({ sort: '-created' });
            setItems(list);
        } catch (e) {
            setError('Failed to load notices.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const startAdd = () => { setEditing('new'); setForm(EMPTY_NOTICE); setError(''); };
    const startEdit = (rec) => {
        setEditing(rec.id);
        setForm({ title: rec.title || '', date: rec.date || '', tag: rec.tag || '', description: rec.description || '', image: null });
        setError('');
    };
    const cancel = () => { setEditing(null); setForm(EMPTY_NOTICE); setError(''); };

    const save = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.date.trim()) {
            setError('Title and date are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('title', form.title.trim());
            fd.append('date', form.date.trim());
            fd.append('tag', form.tag.trim());
            fd.append('description', form.description.trim());
            if (form.image) fd.append('image', form.image);
            if (editing === 'new') {
                await pb.collection('news').create(fd);
            } else {
                await pb.collection('news').update(editing, fd);
            }
            cancel();
            await load();
        } catch (err) {
            setError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete this notice?')) return;
        try {
            await pb.collection('news').delete(id);
            await load();
        } catch (_) {
            setError('Failed to delete.');
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((n) =>
            [n.title, n.tag, n.description, n.date].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
        );
    }, [items, query]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-foreground">Notice</h2>
                {editing === null && (
                    <Button onClick={startAdd} className="font-semibold">
                        <Plus className="mr-2 h-4 w-4" />
                        New Notice
                    </Button>
                )}
            </div>

            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            {editing !== null && (
                <form onSubmit={save} className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="font-display text-lg text-primary">
                        {editing === 'new' ? 'Add New Notice' : 'Edit Notice'}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="n-title">Title *</Label>
                            <Input id="n-title" value={form.title} onChange={set('title')} placeholder="Notice title" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="n-date">Date *</Label>
                            <Input id="n-date" value={form.date} onChange={set('date')} placeholder="e.g. 12 February 2026" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="n-tag">Tag</Label>
                        <Input id="n-tag" value={form.tag} onChange={set('tag')} placeholder="e.g. Press Release, Announcement" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="n-desc">Description</Label>
                        <Textarea id="n-desc" rows={4} value={form.description} onChange={set('description')} placeholder="Notice details" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="n-image">Image (optional)</Label>
                        <Input id="n-image" type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} />
                        {editing !== 'new' && items.find((i) => i.id === editing)?.image && (
                            <img src={imageUrl(items.find((i) => i.id === editing))} alt="Current" className="mt-2 h-24 rounded-md object-cover" />
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={saving} className="font-semibold">
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                        <Button type="button" variant="outline" onClick={cancel}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notices…" className="pl-9" />
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-10 text-center text-muted-foreground">
                    {items.length === 0 ? 'No notices yet. Click "New Notice" to add the first one.' : 'No notices match your search.'}
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((n) => (
                        <div key={n.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
                            {n.image ? (
                                <img src={imageUrl(n)} alt={n.title} className="h-20 w-28 shrink-0 rounded-md object-cover" />
                            ) : (
                                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                                        <CalendarDays className="h-3.5 w-3.5 text-primary" />{n.date}
                                    </span>
                                    {n.tag && <span className="rounded-full bg-accent/10 px-2 py-0.5 font-bold text-accent">{n.tag}</span>}
                                </div>
                                <h3 className="mt-1 font-bold leading-snug text-foreground">{n.title}</h3>
                                {n.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.description}</p>}
                            </div>
                            <div className="flex shrink-0 gap-2">
                                <Button size="icon" variant="outline" onClick={() => startEdit(n)} aria-label="Edit">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => remove(n.id)} aria-label="Delete">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ----------------------------- Photo Gallery ---------------------------- */

const EMPTY_PHOTO = { caption: '', image: null };

function GalleryManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY_PHOTO);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [query, setQuery] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const list = await pb.collection('gallery_photos').getFullList({ sort: '-created' });
            setItems(list);
        } catch (e) {
            setError('Failed to load gallery.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async (e) => {
        e.preventDefault();
        if (!form.image && editingId === null) {
            setError('Please choose an image.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('caption', form.caption.trim());
            if (form.image) fd.append('image', form.image);
            if (editingId) {
                await pb.collection('gallery_photos').update(editingId, fd);
            } else {
                await pb.collection('gallery_photos').create(fd);
            }
            setForm(EMPTY_PHOTO);
            setEditingId(null);
            await load();
        } catch (err) {
            setError('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete this photo?')) return;
        try {
            await pb.collection('gallery_photos').delete(id);
            await load();
        } catch (_) {
            setError('Failed to delete.');
        }
    };

    const startEditCaption = (rec) => {
        setEditingId(rec.id);
        setForm({ caption: rec.caption || '', image: null });
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((p) => (p.caption || '').toLowerCase().includes(q));
    }, [items, query]);

    return (
        <div className="space-y-6">
            <h2 className="font-display text-2xl text-foreground">Photo Gallery</h2>

            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <form onSubmit={save} className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
                <h3 className="font-display text-lg text-primary">{editingId ? 'Edit Photo' : 'Upload New Photo'}</h3>
                <div className="space-y-2">
                    <Label htmlFor="g-caption">Caption (optional)</Label>
                    <Input id="g-caption" value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} placeholder="Short description of the photo" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="g-image">Image {editingId ? '(only to replace current)' : '*'}</Label>
                    <Input id="g-image" type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} />
                </div>
                <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="font-semibold">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        {editingId ? 'Update' : 'Upload'}
                    </Button>
                    {editingId && (
                        <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(EMPTY_PHOTO); }}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    )}
                </div>
            </form>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search captions…" className="pl-9" />
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-10 text-center text-muted-foreground">
                    {items.length === 0 ? 'No photos yet. Upload the first photo above.' : 'No photos match your search.'}
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((p) => (
                        <div key={p.id} className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                            <img src={imageUrl(p)} alt={p.caption || ''} className="aspect-[4/3] w-full object-cover" />
                            {p.caption && (
                                <p className="line-clamp-2 px-2 py-1.5 text-xs font-semibold text-foreground">{p.caption}</p>
                            )}
                            <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => startEditCaption(p)} aria-label="Edit">
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => remove(p.id)} aria-label="Delete">
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ----------------------- Generic Submissions List ---------------------- */

function useSubmissions(collection) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const list = await pb.collection(collection).getFullList({ sort: '-created' });
            setItems(list);
        } catch (e) {
            setError('Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    }, [collection]);

    useEffect(() => { load(); }, [load]);

    const remove = useCallback(async (id) => {
        if (!confirm('Delete this submission?')) return;
        try {
            await pb.collection(collection).delete(id);
            setItems((prev) => prev.filter((r) => r.id !== id));
        } catch (_) {
            setError('Failed to delete.');
        }
    }, [collection]);

    return { items, loading, error, remove, load };
}

function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="grid grid-cols-3 gap-3 border-b border-border py-3 last:border-b-0">
            <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
            <dd className="col-span-2 text-sm text-foreground break-words whitespace-pre-wrap">{value || '—'}</dd>
        </div>
    );
}

/* ----------------------- Join Party Submissions ------------------------ */

function JoinSubmissions() {
    const { items, loading, error, remove } = useSubmissions('membership_requests');
    const [query, setQuery] = useState('');
    const [city, setCity] = useState('all');
    const [viewing, setViewing] = useState(null);

    const cities = useMemo(
        () => ['all', ...Array.from(new Set(items.map((i) => i.city).filter(Boolean))).sort()],
        [items]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((i) => {
            if (city !== 'all' && i.city !== city) return false;
            if (!q) return true;
            return [i.name, i.mobile, i.city, i.reason].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
        });
    }, [items, query, city]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-foreground">Join Party Form Submissions</h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-muted-foreground">{items.length} total</span>
            </div>

            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <div className="flex flex-wrap items-center gap-3">
                <SearchBar value={query} onChange={setQuery} placeholder="Search name, mobile, city…" />
                <select value={city} onChange={(e) => setCity(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {cities.map((c) => <option key={c} value={c}>{c === 'all' ? 'All cities' : c}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-10 text-center text-muted-foreground">
                    {items.length === 0 ? 'No join requests yet.' : 'No submissions match your search.'}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Mobile</th>
                                <th className="px-4 py-3 font-semibold">City</th>
                                <th className="px-4 py-3 font-semibold">Submitted</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-secondary/40">
                                    <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.mobile}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.city}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(r.created)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="outline" onClick={() => setViewing(r)} aria-label="View">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={() => remove(r.id)} aria-label="Delete">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Join Request Details</DialogTitle>
                        <DialogDescription>Submitted on {fmtDate(viewing?.created)}</DialogDescription>
                    </DialogHeader>
                    {viewing && (
                        <dl>
                            <DetailRow label="Name" value={viewing.name} />
                            <DetailRow label="Mobile" value={viewing.mobile} />
                            <DetailRow label="City" value={viewing.city} />
                            <DetailRow label="Reason" value={viewing.reason} />
                            <DetailRow label="Submitted" value={fmtDate(viewing.created)} />
                        </dl>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* ----------------------- Contact Submissions --------------------------- */

function ContactSubmissions() {
    const { items, loading, error, remove } = useSubmissions('contact_submissions');
    const [query, setQuery] = useState('');
    const [viewing, setViewing] = useState(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((i) =>
            [i.name, i.email, i.phone, i.subject, i.message].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
        );
    }, [items, query]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-foreground">Contact Form Submissions</h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-muted-foreground">{items.length} total</span>
            </div>

            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <SearchBar value={query} onChange={setQuery} placeholder="Search name, email, subject, message…" />

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-10 text-center text-muted-foreground">
                    {items.length === 0 ? 'No contact messages yet.' : 'No submissions match your search.'}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Subject</th>
                                <th className="px-4 py-3 font-semibold">Submitted</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-secondary/40">
                                    <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{r.subject || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(r.created)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="outline" onClick={() => setViewing(r)} aria-label="View">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="outline" onClick={() => remove(r.id)} aria-label="Delete">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Contact Message Details</DialogTitle>
                        <DialogDescription>Submitted on {fmtDate(viewing?.created)}</DialogDescription>
                    </DialogHeader>
                    {viewing && (
                        <dl>
                            <DetailRow label="Name" value={viewing.name} />
                            <DetailRow label="Email" value={viewing.email} />
                            <DetailRow label="Phone" value={viewing.phone} />
                            <DetailRow label="Subject" value={viewing.subject} />
                            <DetailRow label="Message" value={viewing.message} />
                            <DetailRow label="Submitted" value={fmtDate(viewing.created)} />
                        </dl>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* -------------------------------- Page --------------------------------- */

const TABS = [
    { id: 'notice', label: 'Notice', icon: Megaphone },
    { id: 'gallery', label: 'Photo Gallery', icon: Images },
    { id: 'join', label: 'Join Party Submissions', icon: Users },
    { id: 'contact', label: 'Contact Submissions', icon: Inbox },
];

export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('notice');

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-secondary/40">
            <Helmet>
                <title>Admin Panel | Andolan Jivi Janata Party</title>
                <meta name="description" content="Admin panel for managing notices, gallery and form submissions." />
            </Helmet>

            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
                <div className="tricolor-bar h-1 w-full" />
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">अं</span>
                        <div className="leading-tight">
                            <p className="font-display text-base text-foreground">Admin Panel</p>
                            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="font-semibold">
                            <Link to="/">View Website</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={onLogout} className="font-semibold">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            >
                                <Icon className="h-4 w-4" />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {tab === 'notice' && <NoticeManager />}
                {tab === 'gallery' && <GalleryManager />}
                {tab === 'join' && <JoinSubmissions />}
                {tab === 'contact' && <ContactSubmissions />}
            </main>
        </div>
    );
}
