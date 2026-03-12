export default function emailLayout({ title, content }) {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,sans-serif;">
    <table align="center" width="600" style="background:white;border-radius:10px;padding:40px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <tr>
        <td align="center" style="padding-bottom:25px;">
          <img 
            src="https://res.cloudinary.com/dejhvmvqe/image/upload/v1772795967/aidloop-removebg-preview_h7n0qt.png" 
            alt="AidLoop"
            style="width:200px;height:auto;display:block;"
          />
        </td>
      </tr>

      <tr>
        <td>
          <h2 style="color:#1f2937;margin-bottom:10px;">${title}</h2>
        </td>
      </tr>

      <tr>
        <td style="color:#4b5563;font-size:15px;line-height:1.6;">
          ${content}
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;font-size:13px;color:#9ca3af;text-align:center;">
          <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:15px;" />
          <p>© ${new Date().getFullYear()} AidLoop</p>
          <p>Connecting volunteers with trusted organizations.</p>
        </td>
      </tr>

    </table>
  </div>
  `;
}