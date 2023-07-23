import { createPortal } from 'react-dom';

export const ModalContainer: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="fixed inset-0 bg-black z-9999 grid place-items-center bg-opacity-50">
      { props.children }
    </div>
  );
};

export const Modal: React.FC<{
  children: React.ReactNode,
}> = (props) => {
  return createPortal(
    <ModalContainer>
      {props.children}
    </ModalContainer>,
    document.body,
  );
};
