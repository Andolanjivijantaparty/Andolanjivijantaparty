import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  Loader2,
  LogOut,
  Search,
  Users,
  X,
  Inbox,
  Megaphone,
  Images,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const API_URL =
  'https://script.google.com/macros/s/AKfycbwahE9tHqsiM_vlcj6XvpWe_ewnO5kUvw3NPbgE3qXAMyF32eeq8EVFivRktajn_QPy/exec';


function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-IN');
}


async function postData(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
}


/* =========================================================
   JOIN PARTY SUBMISSIONS
   ========================================================= */

function JoinSubmissions() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);

  const loadMembers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}?action=getMembers`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to load members');
      }

      setMembers(
        Array.isArray(result.members) ? result.members : []
      );
    } catch (error) {
      console.error('Admin members load error:', error);
      setError('डेटा लोड नहीं हो पाया। दोबारा प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return members;
    }

    return members.filter((member) => {
      return [
        member.name,
        member.mobile,
        member.city,
        member.reason,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(q)
        );
    });
  }, [members, query]);

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-foreground">
            Join Party Submissions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Google Sheet से प्राप्त पार्टी सदस्य आवेदन
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-muted-foreground">
            {members.length} total
          </span>

          <Button
            type="button"
            variant="outline"
            onClick={loadMembers}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-red-600">
          {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="नाम, मोबाइल या शहर खोजें..."
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-12 text-center text-muted-foreground">
          अभी कोई पार्टी सदस्य आवेदन नहीं मिला।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">नाम</th>
                <th className="px-4 py-3">मोबाइल</th>
                <th className="px-4 py-3">शहर</th>
                <th className="px-4 py-3">तारीख</th>
                <th className="px-4 py-3 text-right">देखें</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-card">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-secondary/40"
                >
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {member.name || '—'}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {member.mobile || '—'}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {member.city || '—'}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(member.timestamp)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setViewing(member)}
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => {
          if (!open) {
            setViewing(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              सदस्य आवेदन विवरण
            </DialogTitle>

            <DialogDescription>
              पूरा आवेदन देखें
            </DialogDescription>
          </DialogHeader>

          {viewing && (
            <div className="space-y-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  पूरा नाम
                </p>
                <p className="font-semibold">
                  {viewing.name || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  मोबाइल नंबर
                </p>
                <p className="font-semibold">
                  {viewing.mobile || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  शहर
                </p>
                <p className="font-semibold">
                  {viewing.city || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  पार्टी से जुड़ने का कारण
                </p>
                <p className="whitespace-pre-wrap font-semibold">
                  {viewing.reason || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  आवेदन की तारीख
                </p>
                <p className="font-semibold">
                  {formatDate(viewing.timestamp)}
                </p>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => setViewing(null)}
              >
                <X className="mr-2 h-4 w-4" />
                बंद करें
              </Button>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}


/* =========================================================
   NOTICE
   ========================================================= */

function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    date: '',
    tag: '',
    title: '',
    description: '',
    imageUrl: '',
  });

  const loadNotices = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}?action=getNotices`
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed');
      }

      setNotices(
        Array.isArray(result.notices)
          ? result.notices
          : []
      );
    } catch (error) {
      console.error(error);
      setError('Notice लोड नहीं हो सके।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleChange = (key) => (e) => {
    setForm((old) => ({
      ...old,
      [key]: e.target.value,
    }));
  };

  const addNotice = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError('कृपया Notice का Title लिखें।');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await postData({
        action: 'addNotice',
        date: form.date,
        tag: form.tag,
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
      });

      setForm({
        date: '',
        tag: '',
        title: '',
        description: '',
        imageUrl: '',
      });

      await loadNotices();
    } catch (error) {
      console.error(error);
      setError('Notice save नहीं हो पाया।');
    } finally {
      setSaving(false);
    }
  };

  const removeNotice = async (id) => {
    if (!window.confirm('क्या आप यह Notice delete करना चाहते हैं?')) {
      return;
    }

    try {
      await postData({
        action: 'deleteNotice',
        id,
      });

      await loadNotices();
    } catch (error) {
      console.error(error);
      setError('Notice delete नहीं हो पाया।');
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h2 className="font-display text-2xl text-foreground">
          Notice
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Website पर दिखाने के लिए Notice जोड़ें।
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={addNotice}
        className="space-y-5 rounded-xl border border-border bg-card p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Date
            </label>

            <Input
              type="date"
              value={form.date}
              onChange={handleChange('date')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Tag
            </label>

            <Input
              value={form.tag}
              onChange={handleChange('tag')}
              placeholder="जैसे: महत्वपूर्ण"
            />
          </div>

        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Title *
          </label>

          <Input
            value={form.title}
            onChange={handleChange('title')}
            placeholder="Notice का शीर्षक"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Notice की पूरी जानकारी"
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Image URL
          </label>

          <Input
            value={form.imageUrl}
            onChange={handleChange('imageUrl')}
            placeholder="https://..."
          />

          <p className="text-xs text-muted-foreground">
            अगर Notice में फोटो नहीं लगानी है तो खाली छोड़ दें।
          </p>
        </div>

        <Button
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Notice
            </>
          )}
        </Button>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          Existing Notices
        </h3>

        <Button
          variant="outline"
          size="sm"
          onClick={loadNotices}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          अभी कोई Notice नहीं है।
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {notice.tag && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {notice.tag}
                      </span>
                    )}

                    {notice.date && (
                      <span className="text-xs text-muted-foreground">
                        {notice.date}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold">
                    {notice.title || '—'}
                  </h4>

                  {notice.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {notice.description}
                    </p>
                  )}

                  {notice.imageUrl && (
                    <img
                      src={notice.imageUrl}
                      alt={notice.title || 'Notice'}
                      className="mt-4 max-h-48 rounded-lg object-cover"
                    />
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-red-600"
                  onClick={() => removeNotice(notice.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}


/* =========================================================
   PHOTO GALLERY
   ========================================================= */


function GalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const loadGallery = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?action=getGallery`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Gallery load failed');
      }

      setPhotos(Array.isArray(result.photos) ? result.photos : []);
    } catch (err) {
      console.error(err);
      setError('Gallery लोड नहीं हो पाई।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(
        `${file.name}: फोटो पढ़ी नहीं जा सकी।`
      ));
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setError('');
    setSuccess('');

    if (files.length > 30) {
      setSelectedFiles([]);
      setError('एक बार में अधिकतम 30 फोटो चुनें।');
      e.target.value = '';
      return;
    }

    const invalid = files.find((file) => {
      return (
        !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) ||
        file.size > 4 * 1024 * 1024
      );
    });

    if (invalid) {
      setSelectedFiles([]);
      setError(
        `${invalid.name}: केवल JPG, PNG, WEBP या GIF फोटो चुनें। हर फोटो 4 MB या उससे छोटी होनी चाहिए।`
      );
      e.target.value = '';
      return;
    }

    setSelectedFiles(files);
  };

  const addPhotos = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('कृपया एक या अधिक फोटो चुनें।');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    let uploadedCount = 0;
    const failedFiles = [];

    try {
      const batchSize = 3;
      const totalBatches = Math.ceil(selectedFiles.length / batchSize);

      for (let i = 0; i < selectedFiles.length; i += batchSize) {
        const batch = selectedFiles.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;

        setUploadProgress(
          `बैच ${batchNumber}/${totalBatches} अपलोड हो रहा है...`
        );

        try {
          const images = await Promise.all(
            batch.map(async (file) => ({
              imageData: await readFileAsDataURL(file),
              fileName: file.name,
              mimeType: file.type,
              caption: caption.trim(),
            }))
          );

          const result = await postData({
            action: 'addGalleryBulk',
            images,
          });

          uploadedCount += Number(result.uploadedCount || 0);

          if (Array.isArray(result.failed)) {
            result.failed.forEach((item) => {
              failedFiles.push(
                `${item.fileName}: ${item.message}`
              );
            });
          }
        } catch (batchError) {
          batch.forEach((file) => {
            failedFiles.push(`${file.name}: ${batchError.message}`);
          });
        }
      }

      setSelectedFiles([]);
      const input = document.getElementById('gallery-photo-input');

      if (input) {
        input.value = '';
      }

      await loadGallery();

      if (failedFiles.length > 0) {
        setError(
          `${uploadedCount} फोटो अपलोड हुईं। ${failedFiles.length} फोटो अपलोड नहीं हुईं: ` +
          failedFiles.join(' | ')
        );
      } else {
        setSuccess(`${uploadedCount} फोटो सफलतापूर्वक अपलोड हो गईं।`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'फोटो अपलोड नहीं हो पाईं।');
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const removePhoto = async (id) => {
    if (!window.confirm('क्या आप यह फोटो डिलीट करना चाहते हैं?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await postData({
        action: 'deleteGallery',
        id,
      });

      await loadGallery();
      setSuccess('फोटो डिलीट हो गई।');
    } catch (err) {
      console.error(err);
      setError(err.message || 'फोटो डिलीट नहीं हो पाई।');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-foreground">
          Photo Gallery
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          एक साथ कई फोटो वेबसाइट की Gallery में जोड़ें।
        </p>
      </div>

      {error && (
        <div className="break-words rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={addPhotos}
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="gallery-photo-input"
              className="mb-2 block text-sm font-semibold"
            >
              Select Photos
            </label>

            <Input
              id="gallery-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileChange}
              disabled={saving}
            />

            <p className="mt-2 text-xs text-muted-foreground">
              अधिकतम 30 फोटो चुनें। हर फोटो 4 MB तक हो सकती है।
              JPG, PNG, WEBP और GIF समर्थित हैं।
            </p>

            {selectedFiles.length > 0 && (
              <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                <p className="mb-2 text-sm font-semibold">
                  {selectedFiles.length} फोटो चुनी गईं
                </p>

                <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-muted-foreground">
                  {selectedFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`}>
                      {index + 1}. {file.name}
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={saving}
                  onClick={() => {
                    setSelectedFiles([]);
                    const input = document.getElementById('gallery-photo-input');
                    if (input) input.value = '';
                  }}
                >
                  चयन हटाएँ
                </Button>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="gallery-caption"
              className="mb-2 block text-sm font-semibold"
            >
              Caption (optional)
            </label>

            <Input
              id="gallery-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="फोटो का विवरण"
              disabled={saving}
            />
          </div>

          {uploadProgress && (
            <p className="text-sm font-semibold text-primary">
              {uploadProgress}
            </p>
          )}

          <Button
            type="submit"
            disabled={saving || selectedFiles.length === 0}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length || ''} Photos
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">
          Existing Photos ({photos.length})
        </h3>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadGallery}
          disabled={loading || saving}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          अभी कोई फोटो नहीं है।
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {photo.imageUrl && (
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'AJJP Gallery photo'}
                  className="h-52 w-full object-cover"
                  loading="lazy"
                />
              )}

              <div className="space-y-3 p-4">
                <p className="text-sm text-muted-foreground">
                  {photo.caption || 'No caption'}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600"
                  onClick={() => removePhoto(photo.id)}
                  disabled={saving}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CONTACT SUBMISSIONS
   ========================================================= */

function ContactSubmissions() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}?action=getContacts`
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed');
      }

      setContacts(
        Array.isArray(result.contacts)
          ? result.contacts
          : []
      );
    } catch (error) {
      console.error(error);
      setError('Contact submissions लोड नहीं हो सके।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return [
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(q)
        );
    });
  }, [contacts, query]);

  const removeContact = async (id) => {
    if (
      !window.confirm(
        'क्या आप यह Contact Submission delete करना चाहते हैं?'
      )
    ) {
      return;
    }

    try {
      await postData({
        action: 'deleteContact',
        id,
      });

      await loadContacts();
    } catch (error) {
      console.error(error);
      setError('Contact delete नहीं हो पाया।');
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-foreground">
            Contact Submissions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Website के Contact Form से प्राप्त संदेश
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-muted-foreground">
            {contacts.length} total
          </span>

          <Button
            variant="outline"
            onClick={loadContacts}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="नाम, ईमेल, फोन या विषय खोजें..."
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-12 text-center text-muted-foreground">
          अभी कोई Contact Submission नहीं मिला।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">

            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">नाम</th>
                <th className="px-4 py-3">ईमेल</th>
                <th className="px-4 py-3">विषय</th>
                <th className="px-4 py-3">तारीख</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-card">

              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-secondary/40"
                >

                  <td className="px-4 py-3 font-semibold">
                    {contact.name || '—'}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {contact.email || '—'}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {contact.subject || '—'}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(contact.created)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setViewing(contact)}
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="text-red-600"
                        onClick={() =>
                          removeContact(contact.id)
                        }
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>
      )}

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => {
          if (!open) {
            setViewing(null);
          }
        }}
      >

        <DialogContent className="max-w-lg">

          <DialogHeader>
            <DialogTitle>
              Contact Message
            </DialogTitle>

            <DialogDescription>
              पूरा संदेश देखें
            </DialogDescription>
          </DialogHeader>

          {viewing && (
            <div className="space-y-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  नाम
                </p>
                <p className="font-semibold">
                  {viewing.name || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  ईमेल
                </p>
                <p className="font-semibold break-all">
                  {viewing.email || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  फोन
                </p>
                <p className="font-semibold">
                  {viewing.phone || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  विषय
                </p>
                <p className="font-semibold">
                  {viewing.subject || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  संदेश
                </p>
                <p className="whitespace-pre-wrap rounded-lg bg-secondary/50 p-3">
                  {viewing.message || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  तारीख
                </p>
                <p className="font-semibold">
                  {formatDate(viewing.created)}
                </p>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => setViewing(null)}
              >
                <X className="mr-2 h-4 w-4" />
                बंद करें
              </Button>

            </div>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}


/* =========================================================
   TABS
   ========================================================= */

const TABS = [
  {
    id: 'join',
    label: 'Join Party Submissions',
    icon: Users,
  },
  {
    id: 'notice',
    label: 'Notice',
    icon: Megaphone,
  },
  {
    id: 'gallery',
    label: 'Photo Gallery',
    icon: Images,
  },
  {
    id: 'contact',
    label: 'Contact Submissions',
    icon: Inbox,
  },
];


/* =========================================================
   ADMIN PAGE
   ========================================================= */

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('join');

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary/40">

      <Helmet>
        <title>
          Admin Panel | Andolan Jivi Janata Party
        </title>
      </Helmet>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">

        <div className="tricolor-bar h-1 w-full" />

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

          <div>
            <p className="font-display text-lg font-bold text-foreground">
              Admin Panel
            </p>

            <p className="text-xs text-muted-foreground">
              {user?.username || ''}
            </p>
          </div>

          <div className="flex items-center gap-2">

            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link to="/">
                View Website
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>

          </div>

        </div>

      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        <div className="mb-8 flex flex-wrap gap-2 border-b border-border">

          {TABS.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold ${
                  tab === item.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );

          })}

        </div>

        {tab === 'join' && (
          <JoinSubmissions />
        )}

        {tab === 'notice' && (
          <NoticeManager />
        )}

        {tab === 'gallery' && (
          <GalleryManager />
        )}

        {tab === 'contact' && (
          <ContactSubmissions />
        )}

      </main>

    </div>
  );
}
