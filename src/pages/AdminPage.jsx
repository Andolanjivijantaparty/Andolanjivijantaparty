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
  Images
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
  'https://script.google.com/macros/s/AKfycbxBHwg80L8bkj-UIbWOQvjtsbQMous1QO_Z1I1zqbO_HA0tSLM58sin0rJk6czNaftQ/exec';


function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-IN');
}


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

      const response = await fetch(
        `${API_URL}?action=getMembers`
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || 'Failed to load members'
        );
      }

      setMembers(
        Array.isArray(result.members)
          ? result.members
          : []
      );

    } catch (error) {

      console.error(
        'Admin members load error:',
        error
      );

      setError(
        'डेटा लोड नहीं हो पाया। दोबारा प्रयास करें।'
      );

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
        member.reason
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(q)
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
          onChange={(e) =>
            setQuery(e.target.value)
          }
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

                <th className="px-4 py-3">
                  नाम
                </th>

                <th className="px-4 py-3">
                  मोबाइल
                </th>

                <th className="px-4 py-3">
                  शहर
                </th>

                <th className="px-4 py-3">
                  तारीख
                </th>

                <th className="px-4 py-3 text-right">
                  देखें
                </th>

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
                        onClick={() =>
                          setViewing(member)
                        }
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
                onClick={() =>
                  setViewing(null)
                }
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


/* बाकी Tabs के लिए temporary screen */

function ComingSoon({ title }) {

  return (

    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">

      <h2 className="text-2xl font-bold">

        {title}

      </h2>

      <p className="mt-3 text-muted-foreground">

        यह section अगला step में Admin Panel से जोड़ा जाएगा।

      </p>

    </div>

  );

}


const TABS = [

  {
    id: 'join',
    label: 'Join Party Submissions',
    icon: Users
  },

  {
    id: 'notice',
    label: 'Notice',
    icon: Megaphone
  },

  {
    id: 'gallery',
    label: 'Photo Gallery',
    icon: Images
  },

  {
    id: 'contact',
    label: 'Contact Submissions',
    icon: Inbox
  }

];


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

              {user?.email || ''}

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
                onClick={() =>
                  setTab(item.id)
                }
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
          <ComingSoon title="Notice" />
        )}

        {tab === 'gallery' && (
          <ComingSoon title="Photo Gallery" />
        )}

        {tab === 'contact' && (
          <ComingSoon title="Contact Submissions" />
        )}

      </main>

    </div>

  );

}
