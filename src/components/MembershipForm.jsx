import React, { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const INITIAL = { name: '', mobile: '', city: '', reason: '' };

export default function MembershipForm() {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    const set = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: undefined }));
    };

    const validate = () => {
        const er = {};
        if (form.name.trim().length < 3) er.name = 'कृपया अपना पूरा नाम लिखें।';
        if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) er.mobile = 'कृपया सही 10 अंकों का मोबाइल नंबर लिखें।';
        if (form.city.trim().length < 2) er.city = 'कृपया अपने शहर का नाम लिखें।';
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
            await pb.collection('membership_requests').create({
                name: form.name.trim(),
                mobile: form.mobile.trim(),
                city: form.city.trim(),
                reason: form.reason.trim(),
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
                <h3 className="font-display text-2xl text-foreground">धन्यवाद! आपका आवेदन मिल गया है।</h3>
                <p className="max-w-md text-muted-foreground">
                    हमारी टीम जल्द ही आपसे संपर्क करेगी। जनता की इस आवाज़ को मज़बूत बनाने के लिए आपका स्वागत है।
                </p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                    एक और आवेदन भरें
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="space-y-2">
                <Label htmlFor="name">पूरा नाम *</Label>
                <Input id="name" value={form.name} onChange={set('name')} placeholder="जैसे — राहुल शर्मा" autoComplete="name" />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="mobile">मोबाइल नंबर *</Label>
                <Input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    value={form.mobile}
                    onChange={set('mobile')}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    autoComplete="tel"
                />
                {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="city">शहर *</Label>
                <Input id="city" value={form.city} onChange={set('city')} placeholder="जैसे — लखनऊ" autoComplete="address-level2" />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="reason">जुड़ने का कारण</Label>
                <Textarea
                    id="reason"
                    rows={4}
                    value={form.reason}
                    onChange={set('reason')}
                    placeholder="आप इस आंदोलन से क्यों जुड़ना चाहते हैं? (वैकल्पिक)"
                />
            </div>
            {status === 'error' && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    आवेदन भेजने में समस्या हुई। कृपया थोड़ी देर बाद पुनः प्रयास करें।
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
                        सदस्यता आवेदन भेजें
                    </>
                )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">आपकी जानकारी सुरक्षित रखी जाएगी और केवल पार्टी संपर्क हेतु उपयोग होगी।</p>
        </form>
    );
}
