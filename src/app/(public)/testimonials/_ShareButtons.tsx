'use client';

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useState } from 'react';

interface ShareButtonsProps {
  quote: string;
  name: string;
  role: string;
  id?: string;
}

export default function ShareButtons({ quote, name, role, id }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/testimonials${id ? `/${id}` : ''}`
    : '';
  const text = encodeURIComponent(`"${quote}" — ${name}, ${role}`);
  const url = encodeURIComponent(pageUrl);

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${text}%0A${url}`,
      icon: <WhatsAppIcon className="h-4 w-4" />,
      color: 'hover:text-green-500',
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      icon: <Facebook className="h-4 w-4" />,
      color: 'hover:text-blue-600',
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      icon: <Twitter className="h-4 w-4" />,
      color: 'hover:text-black',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      icon: <Linkedin className="h-4 w-4" />,
      color: 'hover:text-blue-700',
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${url}&text=${text}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: 'hover:text-sky-500',
    },
  ];

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-1 pt-4 mt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <span className="text-xs text-gray-400 mr-1">Share</span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          onClick={(e) => e.stopPropagation()}
          className={`p-1.5 text-gray-400 ${link.color} transition-colors rounded hover:bg-gray-100`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        title="Copy link"
        className={`p-1.5 text-gray-400 transition-colors rounded hover:bg-gray-100 ${copied ? 'text-emerald-600' : 'hover:text-gray-600'}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
