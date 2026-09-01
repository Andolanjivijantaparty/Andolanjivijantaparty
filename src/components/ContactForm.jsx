import React, { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactForm() {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    const set = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: undefined }));
    };

    const validate = () => {
        const er = {};
        if (form.name.trim().length < 3) er.name = 'कृपया अपना नाम लिखें।';
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'कृपया सही ईमेल लिखें।';
        if (form.message.trim().length < 5) er.message = 'कृपया अपना संदेश लिखें।';
        return er;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const er = validate();
        if (Object.keys(er).length) {
            setErrors(er);
            return;
        }
        setStatus('submitting');
        try {
            await pb.collection('contact_submissions').create({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                subject: form.subject.trim(),
                message: form.message.trim(),
            });
            setStatus('success');
            setForm(INITIAL);
        } catch (_) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-accent/30 bg-accent/5 p-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-accent" />
                <h3 className="font-display text-2xl text-foreground">धन्यवाद! आपका संदेश मिल गया।</h3>
                <p className="max-w-md text-muted-foreground">
                    हम जल्द ही आपसे संपर्क करेंगे। आपकी बात तक पहुँचना हमारी ज़िम्मेदारी है।
                </p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                    एक और संदेश भेजें
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="c-name">नाम *</Label>
                    <Input id="c-name" value={form.name} onChange={set('name')} placeholder="अपना नाम" autoComplete="name" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="c-email">ईमेल *</Label>
                    <Input id="c-email" type="email" value={form.email} onChange={set('email')} placeholder="आपका ईमेल" autoComplete="email" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="c-phone">फोन (वैकल्पिक)</Label>
                    <Input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="मोबाइल नंबर" autoComplete="tel" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="c-subject">विषय (वैकल्पिक)</Label>
                    <Input id="c-subject" value={form.subject} onChange={set('subject')} placeholder="संदेश का विषय" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="c-message">संदेश *</Label>
                <Textarea id="c-message" rows={4} value={form.message} onChange={set('message')} placeholder="अपना संदेश यहाँ लिखें" />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            </div>
            {status === 'error' && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    संदेश भेजने में समस्या हुई। कृपया थोड़ी देर बाद पुनः प्रयास करें।
                </p>
            )}
            <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full font-semibold active:scale-[0.98]">
                {status === 'submitting' ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        भेजा जा रहा है…
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        संदेश भेजें
                    </>
                )}
            </Button>
        </form>
    );
}
