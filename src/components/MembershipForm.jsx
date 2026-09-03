import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const API_URL =
  'https://script.google.com/macros/s/AKfycbxBHwg80L8bkj-UIbWOQvjtsbQMous1QO_Z1I1zqbO_HA0tSLM58sin0rJk6czNaftQ/exec';

export default function MembershipForm() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    city: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'कृपया अपना नाम भरें';
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = 'कृपया मोबाइल नंबर भरें';
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = 'कृपया सही 10 अंकों का मोबाइल नंबर भरें';
    }

    if (!form.city.trim()) {
      newErrors.city = 'कृपया अपना शहर भरें';
    }

    if (!form.reason.trim()) {
      newErrors.reason = 'कृपया पार्टी से जुड़ने का कारण लिखें';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus('submitting');

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'join',
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          city: form.city.trim(),
          reason: form.reason.trim()
        })
      });

      setStatus('success');

      setForm({
        name: '',
        mobile: '',
        city: '',
        reason: ''
      });

      setTimeout(() => {
        setStatus('idle');
      }, 4000);

    } catch (error) {
      console.error('Form submission error:', error);

      setStatus('error');

      setTimeout(() => {
        setStatus('idle');
      }, 4000);
    }
  };

  return (
    <section id="membership" className="py-20">
      <div className="max-w-2xl mx-auto px-4">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">
            हमसे जुड़ें
          </h2>

          <p className="text-muted-foreground">
            आंदोलन जीवि जनता पार्टी से जुड़ने के लिए नीचे दिया गया फॉर्म भरें।
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6 rounded-2xl border bg-background shadow-sm"
        >

          <div className="space-y-2">
            <Label htmlFor="name">पूरा नाम</Label>

            <Input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="अपना पूरा नाम लिखें"
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="mobile">मोबाइल नंबर</Label>

            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              placeholder="अपना 10 अंकों का मोबाइल नंबर लिखें"
              maxLength={10}
            />

            {errors.mobile && (
              <p className="text-sm text-destructive">
                {errors.mobile}
              </p>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="city">शहर</Label>

            <Input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              placeholder="अपना शहर लिखें"
            />

            {errors.city && (
              <p className="text-sm text-destructive">
                {errors.city}
              </p>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="reason">
              आप पार्टी से क्यों जुड़ना चाहते हैं?
            </Label>

            <Textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="अपना कारण लिखें"
              rows={5}
            />

            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason}
              </p>
            )}
          </div>


          <Button
            type="submit"
            className="w-full"
            disabled={status === 'submitting'}
          >

            {status === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                आवेदन भेजा जा रहा है...
              </>
            ) : (
              'हमसे जुड़ें'
            )}

          </Button>


          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Submitted Successfully!
              </span>
            </div>
          )}


          {status === 'error' && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-red-600">
              आवेदन भेजा नहीं गया, दोबारा प्रयास करें
            </div>
          )}

        </form>
      </div>
    </section>
  );
}
