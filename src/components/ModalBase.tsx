import { createPortal } from 'react-dom';

export const ModalContainer: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full mx-auto max-w-[600px]">
        { props.children }
      </div>
    </div>
  );
};

export const Modal: React.FC<{ children: React.ReactNode }> = (props) => {
  return createPortal(props.children, document.body);
};
