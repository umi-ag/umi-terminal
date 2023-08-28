import umiLogo from '@/assets/umi.jpeg';
import type { ModalProps } from '@/components/ModalBase';
import { Modal } from '@/components/ModalBase';
import type { UmiTerminalProps } from '@/type';
import React, { useState } from 'react';
import { UmiTerminal } from './Base';

export type UmiSwapModalProps = UmiTerminalProps & ModalProps & {
  hideButton?: boolean;
};

export const UmiTerminalModal: React.FC<UmiSwapModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen ?? false);

  const defaultButton = (
    <button
      className="fixed w-16 h-16 overflow-hidden border-4 border-gray-100 rounded-full shadow-lg cursor-pointer bottom-4 right-4"
      onClick={() => setIsOpen(true)}
    >
      <img src={umiLogo} alt="umi logo" className="rounded-full" />
    </button>
  );

  return (
    <>
      {!props.hideButton && defaultButton}

      <Modal {...props} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <div className="w-[600px]">
          <UmiTerminal {...props} />
          <div className="grid place-items-center">
            <button className="w-8 h-8 mt-4 bg-gray-100 rounded-full" onClick={() => setIsOpen(false)}>✗</button>
          </div>
        </div>
      </Modal>
    </>
  );
};
