export default function emailLayout({ title, content }) {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,sans-serif;">
    <table align="center" width="600" style="background:white;border-radius:8px;padding:30px;">
      
      <tr>
        <td align="center">
          <img 
            src="https://res.cloudinary.com/dejhvmvqe/image/upload/v1772742533/aidloop_tvccyr.jpg" 
            alt="AidLoop"
            style="height:50px;margin-bottom:20px;"
          />
        </td>
      </tr>

      <tr>
        <td>
          <h2 style="color:#1f2937">${title}</h2>
        </td>
      </tr>

      <tr>
        <td style="color:#4b5563;font-size:15px;line-height:1.6;">
          ${content}
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;font-size:13px;color:#9ca3af;">
          <hr/>
          <p>© ${new Date().getFullYear()} AidLoop</p>
          <p>Connecting volunteers with trusted organizations.</p>
        </td>
      </tr>

    </table>
  </div>
  `;
}