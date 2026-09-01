import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setError('');
        try {
            await login(email.trim(), password);
            navigate('/admin');
        } catch (_) {
            setStatus('error');
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-12">
            <Helmet>
                <title>Admin Login | Andolan Jivi Janata Party</title>
                <meta name="description" content="Admin login page for managing notices, gallery and form submissions." />
            </Helmet>
            <div className="w-full max-w-md">
                <Link to="/" className="mb-6 flex items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-2xl text-primary-foreground ring-2 ring-accent ring-offset-2 ring-offset-background">
                        अं
                    </span>
                </Link>
                <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
                    <div className="mb-6 text-center">
                        <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <h1 className="font-display text-2xl text-foreground">Admin Login</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Content & submissions management panel</p>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@andolanjivi.in"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        {error && (
                            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                        )}
                        <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full font-semibold active:scale-[0.98]">
                            {status === 'submitting' ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in…
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </>
                            )}
                        </Button>
                    </form>
                </div>
                <p className="mt-4 text-center text-sm">
                    <Link to="/" className="font-semibold text-primary hover:underline">← Back to website</Link>
                </p>
            </div>
        </div>
    );
}
