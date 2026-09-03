import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Eye,
  Trash2,
  Loader2,
  LogOut,
  RefreshCw,
  X,
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


export default function AdminPage() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

      const data = await response.json();

      if (data.success) {

        setMembers(data.members || []);

      } else {

        setError(
          data.message || 'डेटा लोड नहीं हो पाया'
        );

      }

    } catch (err) {

      console.error(err);

      setError(
        'Google Sheet से डेटा लोड नहीं हो पाया'
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
        member.reason,
        member.timestamp,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(q)
        );

    });

  }, [members, query]);


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

        <meta
          name="description"
          content="Admin Panel"
        />

      </Helmet>


      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">

        <div className="tricolor-bar h-1 w-full" />

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

          <div className="flex items-center gap-3">

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-lg text-primary-foreground">

              अं

            </span>


            <div className="leading-tight">

              <p className="text-base font-bold text-foreground">

                Admin Panel

              </p>


              <p className="text-xs text-muted-foreground">

                {user?.email || ''}

              </p>

            </div>

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



      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">


        {/* TITLE */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">

              <Users className="h-7 w-7 text-primary" />

              Join Party Submissions

            </h1>


            <p className="mt-1 text-sm text-muted-foreground">

              Google Sheet से प्राप्त पार्टी सदस्य आवेदन

            </p>

          </div>


          <div className="flex items-center gap-3">

            <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-muted-foreground">

              {members.length} Total

            </span>


            <Button
              variant="outline"
              onClick={loadMembers}
              disabled={loading}
            >

              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />

              Refresh

            </Button>

          </div>

        </div>



        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-600">

            {error}

          </div>

        )}



        {/* SEARCH */}

        <div className="relative mb-6 max-w-md">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="नाम, मोबाइल या शहर खोजें..."
            className="pl-10"
          />

        </div>



        {/* LOADING */}

        {loading ? (

          <div className="flex justify-center py-20">

            <Loader2 className="h-8 w-8 animate-spin text-primary" />

          </div>

        ) : filteredMembers.length === 0 ? (

          <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center text-muted-foreground">

            अभी कोई Party Member Submission नहीं मिला।

          </div>

        ) : (

          <div className="overflow-x-auto rounded-lg border border-border bg-card">

            <table className="w-full text-sm">

              <thead className="bg-secondary/60">

                <tr>

                  <th className="px-4 py-4 text-left font-semibold">

                    Name

                  </th>


                  <th className="px-4 py-4 text-left font-semibold">

                    Mobile

                  </th>


                  <th className="px-4 py-4 text-left font-semibold">

                    City

                  </th>


                  <th className="px-4 py-4 text-left font-semibold">

                    Submitted

                  </th>


                  <th className="px-4 py-4 text-right font-semibold">

                    Action

                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredMembers.map((member, index) => (

                  <tr
                    key={member.id || index}
                    className="border-t border-border hover:bg-secondary/30"
                  >

                    <td className="px-4 py-4 font-semibold">

                      {member.name || '—'}

                    </td>


                    <td className="px-4 py-4">

                      {member.mobile || '—'}

                    </td>


                    <td className="px-4 py-4">

                      {member.city || '—'}

                    </td>


                    <td className="px-4 py-4 text-muted-foreground">

                      {member.timestamp || '—'}

                    </td>


                    <td className="px-4 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setViewing(member)}
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

      </main>



      {/* DETAILS POPUP */}

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

              Party Member Details

            </DialogTitle>


            <DialogDescription>

              पूरी आवेदन जानकारी

            </DialogDescription>

          </DialogHeader>


          {viewing && (

            <div className="space-y-4">


              <div className="border-b pb-3">

                <p className="text-xs font-semibold text-muted-foreground">

                  NAME

                </p>

                <p className="mt-1 font-semibold">

                  {viewing.name || '—'}

                </p>

              </div>



              <div className="border-b pb-3">

                <p className="text-xs font-semibold text-muted-foreground">

                  MOBILE NUMBER

                </p>

                <p className="mt-1">

                  {viewing.mobile || '—'}

                </p>

              </div>



              <div className="border-b pb-3">

                <p className="text-xs font-semibold text-muted-foreground">

                  CITY

                </p>

                <p className="mt-1">

                  {viewing.city || '—'}

                </p>

              </div>



              <div className="border-b pb-3">

                <p className="text-xs font-semibold text-muted-foreground">

                  REASON

                </p>

                <p className="mt-1 whitespace-pre-wrap">

                  {viewing.reason || '—'}

                </p>

              </div>



              <div>

                <p className="text-xs font-semibold text-muted-foreground">

                  SUBMITTED

                </p>

                <p className="mt-1">

                  {viewing.timestamp || '—'}

                </p>

              </div>


            </div>

          )}


          <Button
            variant="outline"
            onClick={() => setViewing(null)}
          >

            <X className="mr-2 h-4 w-4" />

            Close

          </Button>

        </DialogContent>

      </Dialog>

    </div>

  );

}
