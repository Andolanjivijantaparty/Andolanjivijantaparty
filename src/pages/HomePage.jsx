import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowRight, Briefcase, CalendarDays, GraduationCap, HeartPulse, Landmark, Megaphone, Quote, ShieldCheck, Wheat, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MembershipForm from '@/components/MembershipForm';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
const HERO_IMG = 'https://images.hostinger.com/c11593ad-9d7e-43a5-bbec-53e3f1e7abee.png';
const ABOUT_IMG = 'https://images.hostinger.com/a6772500-1575-4c0f-9523-4ca4d1a67f3e.png';
const VOICE_IMG = 'https://images.hostinger.com/44ec7380-cab7-4f90-9f41-135471670cac.png';
const MARQUEE_ITEMS = ['जनता की आवाज़', 'पारदर्शिता', 'जवाबदेही', 'शिक्षा', 'स्वास्थ्य', 'रोज़गार', 'किसान कल्याण', 'जन-भागीदारी'];

const scrollToSection = (id) => {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
const OBJECTIVES = [{
  num: '०१',
  title: 'जनता तक सत्ता',
  text: 'फैसले दरबारों में नहीं, मोहल्लों और गाँवों में हों — हर नीति में आम नागरिक की सीधी भागीदारी।'
}, {
  num: '०२',
  title: 'जवाबदेही की व्यवस्था',
  text: 'जनता के पैसे और जनता के अधिकारों का हिसाब — हर जनप्रतिनिधि, हर अधिकारी जवाबदेह।'
}, {
  num: '०३',
  title: 'मुद्दों की राजनीति',
  text: 'शिक्षा, स्वास्थ्य, रोज़गार और किसान — जाति-धर्म की राजनीति नहीं, ज़मीनी मुद्दों की लड़ाई।'
}, {
  num: '०४',
  title: 'युवा और महिला नेतृत्व',
  text: 'आंदोलन की अगुवाई में युवाओं और महिलाओं को असली भूमिका — टिकट नहीं, ज़िम्मेदारी।'
}];
const IDEOLOGY = [{
  icon: Users,
  title: 'लोकतंत्र',
  text: 'सत्ता का स्रोत जनता है — हम उसके सेवक हैं, मालिक नहीं।'
}, {
  icon: ShieldCheck,
  title: 'पारदर्शिता',
  text: 'हर फैसला, हर खर्च सार्वजनिक — छिपाने को कुछ नहीं।'
}, {
  icon: Landmark,
  title: 'समानता',
  text: 'संविधान की रक्षा और हर नागरिक को समान अधिकार।'
}, {
  icon: Megaphone,
  title: 'सेवा भाव',
  text: 'राजनीति पद पाने का ज़रिया नहीं, समाज सेवा का माध्यम है।'
}];
const ISSUES = [{
  icon: GraduationCap,
  title: 'शिक्षा',
  text: 'सरकारी स्कूलों की गुणवत्ता, शिक्षकों की भर्ती और हर बच्चे तक मुफ़्त शिक्षा।'
}, {
  icon: HeartPulse,
  title: 'स्वास्थ्य',
  text: 'मुफ़्त इलाज, सुदृढ़ सरकारी अस्पताल और दवाओं की उपलब्धता हर ज़िले में।'
}, {
  icon: Briefcase,
  title: 'रोज़गार',
  text: 'खाली पदों की भर्ती, रोज़गार कैलेंडर और युवाओं के लिए कौशल प्रशिक्षण।'
}, {
  icon: Wheat,
  title: 'किसान कल्याण',
  text: 'MSP की गारंटी, समय पर फसल बीमा और क़र्ज़ से मुक्ति का रोडमैप।'
}, {
  icon: ShieldCheck,
  title: 'भ्रष्टाचार मुक्ति',
  text: 'सरकारी कामों की ऑनलाइन निगरानी और भ्रष्टाचारियों पर कड़ी कार्रवाई।'
}, {
  icon: Users,
  title: 'महिला सुरक्षा',
  text: 'तेज़ न्याय, सुरक्षित सार्वजनिक स्थान और महिलाओं की आर्थिक स्वावलंबन।'
}];
const VOICES = [{
  quote: 'पहली बार कोई पार्टी हमसे वोट से पहले पूछ रही है कि हमारा मुद्दा क्या है। यही असली बदलाव है।',
  name: 'रमेश यादव',
  place: 'किसान, प्रतापगढ़'
}, {
  quote: 'मोहल्ला सभा में मेरी बेटी ने स्कूल की समस्या उठाई और एक हफ़्ते में काम शुरू हो गया।',
  name: 'सुनीता देवी',
  place: 'अध्यापिका, पटना'
}, {
  quote: 'युवाओं को भाषण नहीं, ज़िम्मेदारी मिली है। हम खुद अपने शहर का बजट ट्रैक करते हैं।',
  name: 'आदित्य वर्मा',
  place: 'छात्र नेता, जयपुर'
}];
const NEWS = [{
  date: '१२ फ़रवरी २०२६',
  tag: 'प्रेस विज्ञप्ति',
  title: 'जनता की आवाज़ अभियान: ५० शहरों में मोहल्ला सभाओं की शुरुआत',
  text: 'पार्टी ने घोषणा की कि अगले तीन महीनों में ५० शहरों में नागरिक सभाएँ आयोजित की जाएँगी, जहाँ स्थानीय मुद्दे सीधे दर्ज होंगे।'
}, {
  date: '२८ जनवरी २०२६',
  tag: 'घोषणा',
  title: 'रोज़गार कैलेंडर पर श्वेत पत्र जारी',
  text: 'खाली सरकारी पदों और भर्ती प्रक्रिया में देरी पर पार्टी ने श्वेत पत्र जारी कर सरकार से जवाब माँगा।'
}, {
  date: '१० जनवरी २०२६',
  tag: 'आंदोलन',
  title: 'किसान MSP पदयात्रा सम्पन्न — १२ ज़िलों से हज़ारों किसान शामिल',
  text: 'MSP की कानूनी गारंटी की माँग को लेकर निकाली गई पदयात्रा शांतिपूर्ण ढंग से सम्पन्न हुई।'
}, {
  date: '२२ दिसंबर २०२५',
  tag: 'समाचार',
  title: 'पारदर्शिता पोर्टल: पार्टी के चंदे का पूरा ब्योरा सार्वजनिक',
  text: 'अपनी प्रतिबद्धता के अनुरूप पार्टी ने अपने चंदे और खर्च का पूरा विवरण सार्वजनिक किया।'
}];
function SectionHeading({
  kicker,
  title,
  dark = false
}) {
  return <div className="mb-10 max-w-2xl">
            <p className={`mb-2 text-sm font-bold uppercase tracking-[0.2em] ${dark ? 'text-primary' : 'text-primary'}`}>{kicker}</p>
            <h2 className={`font-display text-3xl leading-snug sm:text-4xl ${dark ? 'text-background' : 'text-foreground'}`}>{title}</h2>
            <div className="tricolor-bar mt-4 h-1 w-24 rounded-full" />
        </div>;
}
export default function HomePage() {
  const [newsItems, setNewsItems] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    pb.collection('news').getFullList({ sort: '-created' }).then(setNewsItems).catch(() => {});
    pb.collection('gallery_photos').getFullList({ sort: '-created' }).then(setPhotos).catch(() => {});
  }, []);

  const photoUrl = (rec) => (rec?.image ? pb.files.getURL(rec, rec.image) : '');

  return <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>आंदोलन जीवि जनता पार्टी — जनता की आवाज़, जनता का आंदोलन</title>
                <meta name="description" content="आंदोलन जीवि जनता पार्टी — जनता की आवाज़ को सत्ता तक पहुँचाने का जन-आंदोलन। पारदर्शिता, जवाबदेही और जन-भागीदारी के लिए हमसे जुड़ें।" />
            </Helmet>
            <Seo title="आंदोलन जीवि जनता पार्टी — जनता की आवाज़" description="जनता की आवाज़ को सत्ता तक पहुँचाने का जन-आंदोलन। पारदर्शिता, जवाबदेही और जन-भागीदारी के लिए हमसे जुड़ें।" image={HERO_IMG} siteName="आंदोलन जीवि जनता पार्टी" />
            <Header />

            {/* HERO */}
            <section id="home" className="relative flex min-h-[100dvh] items-center overflow-hidden">
                <img src={HERO_IMG} alt="जनसभा में एकत्रित जनता" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
                <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-4 py-1.5 text-sm font-semibold text-background backdrop-blur">
                            <Megaphone className="h-4 w-4 text-primary" />
                            एक जन-आंदोलन, एक प्रतिबद्धता
                        </span>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-background sm:text-6xl lg:text-7xl"><span style={{
              fontSize: "36px",
              lineHeight: "normal"
            }}><span style={{
                lineHeight: "normal"
              }}><span style={{
                  lineHeight: "normal"
                }}><span style={{
                    lineHeight: "normal"
                  }}><p style={{
                      fontStyle: "normal",
                      fontVariantCaps: "normal",
                      fontWidth: "normal",
                      lineHeight: "normal",
                      fontFamily: "\"Kohinoor Devanagari\"",
                      fontSizeAdjust: "none",
                      fontKerning: "auto",
                      fontVariantAlternates: "normal",
                      fontVariantLigatures: "normal",
                      fontVariantNumeric: "normal",
                      fontVariantEastAsian: "normal",
                      fontVariantPosition: "normal",
                      fontFeatureSettings: "normal",
                      fontOpticalSizing: "auto",
                      fontVariationSettings: "normal"
                    }}><b>सत्ता</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>किसी</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>की</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>भी</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>हो</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b>, </b></span><b>सवाल</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>जनता</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>के</b><span style={{
                        fontStyle: "normal",
                        fontVariantCaps: "normal",
                        fontWidth: "normal",
                        lineHeight: "normal",
                        fontFamily: "\"Helvetica Neue\"",
                        fontSizeAdjust: "none",
                        fontKerning: "auto",
                        fontVariantAlternates: "normal",
                        fontVariantLigatures: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        fontVariantPosition: "normal",
                        fontVariantEmoji: "normal",
                        fontFeatureSettings: "normal",
                        fontOpticalSizing: "auto",
                        fontVariationSettings: "normal"
                      }}><b> </b></span><b>होंगे।</b></p></span></span></span></span></h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/85"><span style={{
              fontSize: "21px",
              lineHeight: "normal"
            }}><strong>आंदोलन जीवि जनता पार्टी</strong></span> —&nbsp;<span style={{
              fontSize: "18px",
              lineHeight: "normal"
            }}><span style={{
                lineHeight: "normal"
              }}><span style={{
                  lineHeight: "normal"
                }}><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}>“</span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>यह</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>विचार</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>किसी</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>व्यक्ति</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>विशेष</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>के</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>विरोध</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>या</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>समर्थन</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>के</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>लिए</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>नहीं</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}>, </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>बल्कि</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>लोकतंत्र</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>में</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>जनता</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>के</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>सवालों</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>और</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>जवाबदेही</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>के</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>महत्व</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>को</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>आगे</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>बढ़ाने</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>के</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>उद्देश्य</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>से</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>अपनाया</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>गया</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>है।</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>हमारा</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>उद्देश्य</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>किसी</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>भी</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>नेता</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}>, </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>की</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>छवि</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>या</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>प्रतिष्ठा</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>को</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>ठेस</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>पहुँचाना</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>नहीं</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>है</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>बल्कि</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>जानता</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>के</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>मुद्दों</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>पर</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>बात</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>करने</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>का</span><span style={{
                    fontWidth: "normal",
                    lineHeight: "normal",
                    fontFamily: "\"Helvetica Neue\"",
                    fontSizeAdjust: "none",
                    fontKerning: "auto",
                    fontVariantAlternates: "normal",
                    fontVariantLigatures: "normal",
                    fontVariantNumeric: "normal",
                    fontVariantEastAsian: "normal",
                    fontVariantPosition: "normal",
                    fontFeatureSettings: "normal",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: "normal"
                  }}> </span><span style={{
                    fontFamily: "\"Kohinoor Devanagari\""
                  }}>है</span></span></span></span><span style={{
              fontFamily: "\"Kohinoor Devanagari\"",
              fontSize: "13px"
            }}></span><span style={{
              fontSize: "13px",
              fontWidth: "normal",
              lineHeight: "normal",
              fontFamily: "\"Helvetica Neue\"",
              fontSizeAdjust: "none",
              fontKerning: "auto",
              fontVariantAlternates: "normal",
              fontVariantLigatures: "normal",
              fontVariantNumeric: "normal",
              fontVariantEastAsian: "normal",
              fontVariantPosition: "normal",
              fontFeatureSettings: "normal",
              fontOpticalSizing: "auto",
              fontVariationSettings: "normal"
            }}>&nbsp;</span></p>
                    </Reveal>
                    <Reveal delay={0.3}>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button asChild size="lg" className="h-12 px-8 text-base font-bold active:scale-[0.98]">
                                <a href="#join" onClick={(e) => { e.preventDefault(); scrollToSection('join'); }}>
                                    <Users className="mr-2 h-5 w-5" />
                                    हमसे जुड़ें
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 border-background/40 bg-transparent px-8 text-base font-semibold text-background hover:bg-background/10 hover:text-background">
                                <a href="#ideology" onClick={(e) => { e.preventDefault(); scrollToSection('ideology'); }}>
                                    हमारी विचारधारा
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </Reveal>
                </div>
                <div className="tricolor-bar absolute inset-x-0 bottom-0 h-1.5" />
            </section>

            {/* MARQUEE */}
            <div className="overflow-hidden border-b border-border bg-primary py-3" aria-hidden="true">
                <div className="animate-marquee flex w-max items-center gap-8">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-lg text-primary-foreground">
                            {item}
                            <span className="h-2 w-2 rounded-full bg-background/70" />
                        </span>)}
                </div>
            </div>

            {/* ABOUT */}
            <section id="about" className="scroll-mt-24 py-20 sm:py-28">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
                    <Reveal>
                        <div className="relative">
                            <img src={ABOUT_IMG} alt="समुदाय के स्वयंसेवक चर्चा करते हुए" className="w-full rounded-lg object-cover shadow-xl" />
                            <div className="absolute -bottom-5 -right-3 rounded-lg bg-accent px-5 py-3 text-accent-foreground shadow-lg sm:-right-5">
                                <p className="font-display text-2xl">२०26 से</p>
                                <p className="text-xs font-semibold">जनता के बीच, जनता के साथ</p>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <SectionHeading kicker="हमारे बारे में" title="सड़क से उठा आंदोलन, जनता की बनी पार्टी" />
                        <div className="-mt-4 space-y-4 leading-relaxed text-muted-foreground">
                            <p>
                                आंदोलन जीवि जनता पार्टी की शुरुआत किसी दफ़्तर से नहीं, बल्कि सड़कों, खेतों और मोहल्लों से हुई — जहाँ आम इंसान
                                अपनी बात कहने की जगह तलाशता है। हम वो कार्यकर्ता हैं जिन्होंने आंदोलनों में जनता का दर्द देखा और तय किया कि
                                अब आवाज़ सिर्फ सड़क तक नहीं, सत्ता तक पहुँचेगी।
                            </p>
                            <p>
                                हमारी पार्टी का हर फैसला मोहल्ला सभाओं और जन-संवाद से गुज़रता है। यहाँ नेता ऊपर से नहीं उतरते —
                                समुदाय के भीतर से उभरते हैं।
                            </p>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                            <div>
                                <p className="font-display text-3xl text-primary">
                                    <CountUp value={120} suffix="+" />
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground">जनसभाएँ</p>
                            </div>
                            <div>
                                <p className="font-display text-3xl text-primary">
                                    <CountUp value={75} suffix="+" />
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground">ज़िलों में सक्रिय</p>
                            </div>
                            <div>
                                <p className="font-display text-3xl text-primary">
                                    <CountUp value={12} />
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground">प्रमुख मुद्दे</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* PURPOSE */}
            <section id="purpose" className="scroll-mt-24 border-y border-border bg-secondary/60 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading kicker="हमारा उद्देश्य" title="राजनीति बदलने नहीं, राजनीति सुधारने आए हैं" />
                    </Reveal>
                    <div className="grid gap-10 lg:grid-cols-5">
                        <Reveal className="lg:col-span-2">
                            <p className="border-l-4 border-primary pl-6 font-display text-2xl leading-relaxed text-foreground">
                                “हमारा उद्देश्य सत्ता हथियाना नहीं — सत्ता को जनता के हाथ लौटाना है।”
                            </p>
                            <p className="mt-6 leading-relaxed text-muted-foreground">
                                हर नीति में जनता की सहमति, हर खर्च में जनता की नज़र और हर फैसले में जनता का हित — यही हमारे आंदोलन का सार है।
                            </p>
                        </Reveal>
                        <div className="lg:col-span-3">
                            {OBJECTIVES.map((o, i) => <Reveal key={o.num} delay={i * 0.08}>
                                    <div className="flex gap-5 border-t border-border py-5 first:border-t-0 first:pt-0">
                                        <span className="font-display text-2xl text-primary">{o.num}</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">{o.title}</h3>
                                            <p className="mt-1 leading-relaxed text-muted-foreground">{o.text}</p>
                                        </div>
                                    </div>
                                </Reveal>)}
                        </div>
                    </div>
                </div>
            </section>

            {/* IDEOLOGY */}
            <section id="ideology" className="scroll-mt-24 bg-accent py-20 text-accent-foreground sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading dark kicker="हमारी विचारधारा" title="चार स्तंभ, एक संकल्प" />
                    </Reveal>
                    <div className="grid gap-px overflow-hidden rounded-lg bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
                        {IDEOLOGY.map((v, i) => <Reveal key={v.title} delay={i * 0.08} className="bg-accent">
                                <div className="flex h-full flex-col gap-4 p-7">
                                    <v.icon className="h-8 w-8 text-primary" strokeWidth={1.75} />
                                    <h3 className="font-display text-xl">{v.title}</h3>
                                    <p className="text-sm leading-relaxed text-accent-foreground/80">{v.text}</p>
                                </div>
                            </Reveal>)}
                    </div>
                </div>
            </section>

            {/* ISSUES */}
            <section id="issues" className="scroll-mt-24 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading kicker="प्रमुख मुद्दे" title="जिन मुद्दों पर हम लड़ते हैं" />
                    </Reveal>
                    <div className="grid gap-x-12 md:grid-cols-2">
                        {ISSUES.map((issue, i) => <Reveal key={issue.title} delay={i % 2 * 0.08}>
                                <div className="group flex gap-5 border-t border-border py-6 transition-colors hover:bg-secondary/50">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <issue.icon className="h-6 w-6" strokeWidth={1.75} />
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-bold">{issue.title}</h3>
                                        <p className="mt-1 leading-relaxed text-muted-foreground">{issue.text}</p>
                                    </div>
                                </div>
                            </Reveal>)}
                    </div>
                </div>
            </section>

            {/* VOICE */}
            <section id="voice" className="scroll-mt-24 border-y border-border bg-secondary/60 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading kicker="जनता की आवाज़" title="लोग क्या कह रहे हैं" />
                    </Reveal>
                    <div className="grid gap-10 lg:grid-cols-5">
                        <Reveal className="lg:col-span-2">
                            <img src={VOICE_IMG} alt="जनसभा में बोलता नागरिक" className="h-full max-h-[420px] w-full rounded-lg object-cover shadow-lg" />
                        </Reveal>
                        <div className="space-y-6 lg:col-span-3">
                            {VOICES.map((v, i) => <Reveal key={v.name} delay={i * 0.08}>
                                    <figure className="rounded-lg border border-border bg-card p-6 shadow-sm">
                                        <Quote className="mb-3 h-6 w-6 text-primary" />
                                        <blockquote className="leading-relaxed text-foreground">{v.quote}</blockquote>
                                        <figcaption className="mt-4 text-sm">
                                            <span className="font-bold">{v.name}</span>
                                            <span className="text-muted-foreground"> — {v.place}</span>
                                        </figcaption>
                                    </figure>
                                </Reveal>)}
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWS */}
            <section id="news" className="scroll-mt-24 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading kicker="समाचार एवं अपडेट" title="आंदोलन की ताज़ा ख़बरें" />
                    </Reveal>
                    <div className="divide-y divide-border border-y border-border">
                        {newsItems.length === 0 ? <p className="py-10 text-center text-muted-foreground">अभी कोई समाचार नहीं है।</p> : newsItems.map((n, i) => <Reveal key={n.id} delay={i * 0.06}>
                                <article className="grid gap-3 py-6 transition-colors hover:bg-secondary/50 sm:grid-cols-[180px_1fr] sm:gap-8">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground sm:flex-col sm:items-start sm:gap-1">
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4 text-primary" />
                                            {n.date}
                                        </span>
                                        {n.tag && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">{n.tag}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold leading-snug">{n.title}</h3>
                                        {n.description && <p className="leading-relaxed text-muted-foreground">{n.description}</p>}
                                        {n.image && <img src={photoUrl(n)} alt={n.title} className="mt-2 max-h-72 w-full rounded-lg object-cover" />}
                                    </div>
                                </article>
                            </Reveal>)}
                    </div>

                    {/* Media gallery placeholders */}
                    <Reveal delay={0.1}>
                        <div className="mt-12">
                            <h3 className="mb-5 font-display text-xl">फोटो / वीडियो गैलरी</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {photos.length === 0 ? <p className="col-span-full py-10 text-center text-muted-foreground">अभी कोई फोटो नहीं है।</p> : photos.map((p) => (
                                    <figure key={p.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                                        <img src={photoUrl(p)} alt={p.caption || ''} className="aspect-[4/3] w-full object-cover" />
                                        {p.caption && <figcaption className="line-clamp-2 px-2 py-1.5 text-xs font-semibold text-foreground">{p.caption}</figcaption>}
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* JOIN */}
            <section id="join" className="scroll-mt-24 bg-foreground py-20 text-background sm:py-28">
                <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2">
                    <Reveal>
                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">हमसे जुड़ें</p>
                        <h2 className="font-display text-3xl leading-snug sm:text-5xl">
                            आंदोलन की ताक़त<br />
                            <span className="text-primary">आप</span> हैं।
                        </h2>
                        <p className="mt-6 max-w-md leading-relaxed text-background/75">
                            सदस्य बनें, अपने क्षेत्र के मुद्दे उठाएँ और जनता की इस आवाज़ को और मज़बूत करें। फ़ॉर्म भरें — हमारी टीम आपसे संपर्क करेगी।
                        </p>
                        <ul className="mt-8 space-y-3 text-background/85">
                            {['मोहल्ला सभाओं में सीधी भागीदारी', 'पार्टी की नीतियों पर अपनी राय दें', 'अपने क्षेत्र में आंदोलन का नेतृत्व करें'].map(point => <li key={point} className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <span>{point}</span>
                                </li>)}
                        </ul>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="text-foreground">
                            <MembershipForm />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading kicker="संपर्क करें" title="हम एक संदेश की दूरी पर हैं" />
                    </Reveal>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {[{
            title: 'केन्द्रीय कार्यालय',
            lines: ['आंदोलन जीवि जनता पार्टी', 'नई दिल्ली, भारत — 110001']
          }, {
            title: 'फोन',
            lines: ['+91 98XXXXXX00', 'सुबह 10 बजे — शाम 6 बजे']
          }, {
            title: 'ईमेल',
            lines: ['sampark@andolanjivijantaparty.in', 'media@andolanjivijantaparty.in']
          }].map((c, i) => <Reveal key={c.title} delay={i * 0.08}>
                                <div className="h-full rounded-lg border border-border bg-card p-6 shadow-sm">
                                    <h3 className="font-display text-lg text-primary">{c.title}</h3>
                                    {c.lines.map(l => <p key={l} className="mt-1.5 text-sm text-muted-foreground">
                                            {l}
                                        </p>)}
                                </div>
                            </Reveal>)}
                    </div>
                    <Reveal delay={0.2}>
                        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg bg-primary px-6 py-8 text-center sm:flex-row sm:text-left">
                            <p className="font-display text-xl text-primary-foreground sm:text-2xl">बदलाव की शुरुआत आपसे होती है — आज ही जुड़ें।</p>
                            <Button asChild size="lg" variant="secondary" className="shrink-0 font-bold">
                                <a href="#join" onClick={(e) => { e.preventDefault(); scrollToSection('join'); }}>
                                    सदस्य बनें
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </Reveal>

                    <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
                        <Reveal>
                            <h3 className="font-display text-2xl text-foreground">हमें लिखें</h3>
                            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                                अपने सुझाव, शिकायत या सहयोग की बात हमसे साझा करें। आपका हर संदेश सीधे पार्टी के व्यवस्थापक तक पहुँचता है।
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                <li>• आपकी बात सुनी जाएगी और गोपनीय रखी जाएगी।</li>
                                <li>• हमारी टीम आवश्यक होने पर आपसे संपर्क करेगी।</li>
                                <li>• जन-भागीदारी ही इस आंदोलन की नींव है।</li>
                            </ul>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <ContactForm />
                        </Reveal>
                    </div>
                </div>
            </section>

            <Footer />
        </div>;
}
