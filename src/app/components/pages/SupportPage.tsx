import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Send } from 'lucide-react';
import { PageLoader } from '../layout/PageLoader';

export function SupportPage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending email
    console.log('Support email sent to: tanishbala567@gmail.com');
    console.log('From:', formData.email);
    console.log('Subject:', formData.subject);
    console.log('Message:', formData.message);
    console.log('Attachment:', file?.name);

    // In a real app, you would send this data to an API endpoint that handles email
    // For now, we'll just show a success message
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ email: '', subject: '', message: '' });
      setFile(null);
      setSubmitted(false);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <PageLoader loadingDuration={2500}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Support
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
            We're here to help. Send us a message and we'll get back to you soon.
          </p>
        </motion.div>

        {/* Support form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-lg p-4 md:p-8"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Message Sent!
              </h3>
              <p className="text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                We'll get back to you as soon as possible.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  placeholder="How can we help?"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  placeholder="Tell us more about your issue..."
                  required
                />
              </div>

              {/* File upload */}
              <div>
                <label className="block mb-2 text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                  Attachment (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-md cursor-pointer hover:bg-[#ecfeff] transition-all"
                  >
                    <Upload className="w-5 h-5 text-[#6B6B6B]" />
                    <span className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                      {file ? file.name : 'Click to attach a file or image'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-md hover:bg-[#3A3A3A] transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-[#6B6B6B]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <p>
            Messages are sent to{' '}
            <span className="text-black font-medium">tanishbala567@gmail.com</span>
          </p>
          <p className="mt-2">Average response time: 24 hours</p>
        </motion.div>
      </div>
    </PageLoader>
  );
}