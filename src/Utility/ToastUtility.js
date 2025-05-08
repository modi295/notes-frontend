import { toast } from 'react-toastify';

const commonOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccessToast = (message) => {
  toast.success(message, commonOptions);
};

export const showErrorToast = (message) => {
  toast.error(message, commonOptions);
};

export const showInfoToast = (message) => {
  toast.info(message, commonOptions);
};

export const showWarningToast = (message) => {
  toast.warning(message, commonOptions);
};
