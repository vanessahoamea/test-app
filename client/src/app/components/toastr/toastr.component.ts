import * as toast from 'toastr';

toast.options.preventDuplicates = true;
toast.options.timeOut = 1500;
toast.options.extendedTimeOut = 1500;
toast.options.progressBar = true;
toast.options.closeButton = true;

const success = (message: string) => toast.success(message);
const error = (message: string) => toast.error(message);
const warning = (message: string) => toast.warning(message);
const info = (message: string) => toast.info(message);
const clear = () => toast.clear();

export const toastr = {
  success,
  error,
  warning,
  info,
  clear
};
