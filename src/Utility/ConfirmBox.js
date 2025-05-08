import Swal from 'sweetalert2';

if (!document.getElementById('swal-custom-style')) {
  const style = document.createElement('style');
  style.id = 'swal-custom-style';
  style.innerHTML = `
    .custom-swal-popup {
      font-family: 'Segoe UI', sans-serif;
      font-size: 16px !important;
    }

    .custom-swal-title {
      font-size: 18px !important;
      color: #716add !important;
    }

    .custom-swal-confirm, .custom-swal-cancel {
      font-size: 14px !important;
      padding: 6px 16px !important;
      border-radius: 8px;
    }
    .swal2-icon { 
      font-size: 8px !important; 
    }
  `;
  document.head.appendChild(style);
}

export const showConfirm = async (message = "Are you sure?") => {
  const result = await Swal.fire({
    title: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#734dc4',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    position: 'top',
    width: '400px',
    padding: '0.8rem',
    background: '#fff',
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
    }
  });

  return result.isConfirmed;
};

export const showAlert = async (message = "Alert message", icon = "warning") => {
  await Swal.fire({
    title: message,
    icon: icon,
    confirmButtonColor: '#734dc4',
    confirmButtonText: 'OK',
    position: 'top',
    width: '400px',
    padding: '0.8rem',
    background: '#fff',
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm',
    }
  });
};

