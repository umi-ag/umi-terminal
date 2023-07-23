import ReactModal from 'react-modal';

export const ModalContainer: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="fixed inset-0 bg-black z-9999 grid place-items-center bg-opacity-50">
      { props.children }
    </div>
  );
};

ReactModal.setAppElement(document.body);

const style: ReactModal.Props['style'] = {
  overlay: {
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  content: {
    display: 'grid',
    placeItems: 'center',
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    margin: 'auto',
    padding: '0',
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '0',
    backgroundColor: 'transparent',
    overflow: 'visible',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
  },
};

export const Modal: React.FC<ReactModal.Props> = (props) => {
  return (
    <ReactModal style={style} {...props}>
      {props.children}
    </ReactModal>
  );
};
