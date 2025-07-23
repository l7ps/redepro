
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function PrintLayout() {
  const [logo, setLogo] = useState<string | null>(null);
  const [footer, setFooter] = useState<string | null>(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    // This runs on the client after mount, so localStorage is available.
    const savedLogo = localStorage.getItem('whiteLabelLogo');
    const savedFooter = localStorage.getItem('whiteLabelFooter');
    const currentDate = new Date().toLocaleDateString('pt-BR');

    setLogo(savedLogo);
    setFooter(savedFooter);
    setDate(currentDate);
  }, []);

  return (
    <div className="hidden print:block">
      <div id="print-header">
        <div className="flex items-center">
          {logo && <Image src={logo} alt="Logo" width={100} height={40} className="object-contain" data-ai-hint="logo company" />}
        </div>
        <div className="text-right">
          <p className="font-semibold">Data de Emissão</p>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
      </div>
      <div id="print-footer">
        <p className="text-gray-600">
            {footer || 'Os valores podem sofrer alteração, entre em contato diretamente com o parceiro.'}
        </p>
      </div>
    </div>
  );
}
