import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ ปิด modal ที่เปิดค้างไว้
      document.querySelectorAll('.modal.show').forEach(modalEl => {
        const modalInstance = window.bootstrap?.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        }
      });

      // ✅ ลบ backdrop และ reset body class
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';

      // ✅ ไปหน้าหลัก และ refresh
      navigate('/', { replace: true });
      window.location.reload();
    }, 1500);

    return () => clearTimeout(timer); // เคลียร์ timer เมื่อ unmount
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('เข้าสู่ระบบ:', { username, password });
    // คุณสามารถย้าย navigate ไปที่นี่ถ้าจะเปลี่ยนลอจิก
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-3 overflow-hidden">
          
          {/* HEADER */}
          <div className="position-relative py-3 border-bottom">
            <h5 className="text-center m-0 fw-bold">เข้าสู่ระบบ</h5>
            <button
              type="button"
              className="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
              aria-label="Close"
              onClick={() => {
                navigate('/');
              }}
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body px-4 pt-4">
            <div className="text-center mb-3">
              <img
                src="https://www.baraliresort.com/images/logo.png"
                alt="logo"
                width="113"
                height="88"
              />
            </div>

            <p className="text-center fw-semibold mb-4">
              กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-semibold">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  className="form-control rounded-2"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  className="form-control rounded-2"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100 fw-bold text-white"
                style={{ backgroundColor: '#00bfff' }}
              >
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;