const nodemailer = require('nodemailer');

// ─── Transporter ────────────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────────
function val(v) { return v || '—'; }
function bool(v) { return v ? 'Yes' : 'No'; }

function row(label, value, shade) {
  const bg = shade ? 'background:#f8f9fd;' : '';
  return `
    <tr>
      <td style="${bg}padding:11px 18px;font-size:13px;font-weight:700;color:#7a736d;
                  text-transform:uppercase;letter-spacing:0.4px;width:38%;
                  border-bottom:1px solid #dbe1eb;vertical-align:top;">${label}</td>
      <td style="${bg}padding:11px 18px;font-size:13.5px;color:#2c2825;
                  border-bottom:1px solid #dbe1eb;vertical-align:top;">${val(value)}</td>
    </tr>`;
}

function sectionHeader(title) {
  return `
    <tr>
      <td colspan="2" style="background:#162238;padding:10px 18px;">
        <span style="font-size:12px;font-weight:800;color:#ffffff;
                     text-transform:uppercase;letter-spacing:1px;">${title}</span>
      </td>
    </tr>`;
}

// ─── Student Confirmation Email ───────────────────────────────────────────────────
async function sendStudentConfirmation({ firstName, lastName, email, refId }) {
  if (!email) return;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Email not configured – skipping student confirmation email.');
    return;
  }

  const transporter = createTransporter();
  const refCode = `#${String(refId).padStart(4, '0')}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Form Submitted – Edmissions World</title>
</head>
<body style="margin:0;padding:0;background:#e9eff5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e9eff5;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:#fff;border-radius:16px;
                    overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#162238 0%,#c0392b 100%);
                     padding:32px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.65);
                      text-transform:uppercase;letter-spacing:2px;">Form Submitted</p>
            <h1 style="margin:0;font-size:24px;color:#fff;font-weight:800;letter-spacing:1px;">
              EDMISSIONS WORLD
            </h1>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.75);font-style:italic;">
              Your Gateway to Global Education
            </p>
          </td>
        </tr>

        <!-- Success Badge -->
        <tr>
          <td align="center" style="padding:36px 40px 0;">
            <div style="background:#eafaf1;border-radius:50%;width:72px;height:72px;
                        line-height:72px;font-size:36px;text-align:center;
                        display:inline-block;">✅</div>
            <h2 style="margin:16px 0 8px;font-size:22px;color:#162238;font-weight:700;">
              Form Successfully Submitted!
            </h2>
            <p style="margin:0;font-size:15px;color:#7a736d;">
              Dear <strong style="color:#162238;">${firstName} ${lastName}</strong>,
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="font-size:15px;color:#4a4a4a;line-height:1.7;margin:0 0 16px;">
              Thank you for submitting your <strong>Study Abroad Walk-In Form</strong> at
              Edmissions World. We have successfully received your application and our
              team will review your details shortly.
            </p>

            <!-- Ref Box -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f0f2f8;border-radius:10px;margin:0 0 20px;">
              <tr>
                <td style="padding:18px 24px;text-align:center;">
                  <p style="margin:0 0 6px;font-size:12px;color:#7a736d;
                             text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                    Your Reference ID
                  </p>
                  <p style="margin:0;font-size:28px;font-weight:800;color:#162238;
                             font-family:monospace;letter-spacing:3px;">${refCode}</p>
                </td>
              </tr>
            </table>

            <p style="font-size:15px;color:#4a4a4a;line-height:1.7;margin:0 0 16px;">
              Please keep your Reference ID safe — you may need it when following up
              with our counselors. Our team will reach out to you soon.
            </p>

            <!-- Next Steps -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1.5px solid #dbe1eb;border-radius:10px;margin:0 0 24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#162238;
                             text-transform:uppercase;letter-spacing:0.5px;">What happens next?</p>
                  <p style="margin:0 0 10px;font-size:14px;color:#4a4a4a;line-height:1.6;">
                    📞 &nbsp;Our counselor will call you within <strong>1–2 business days</strong>.
                  </p>
                  <p style="margin:0 0 10px;font-size:14px;color:#4a4a4a;line-height:1.6;">
                    📋 &nbsp;We will assess your profile and suggest suitable universities.
                  </p>
                  <p style="margin:0;font-size:14px;color:#4a4a4a;line-height:1.6;">
                    🌍 &nbsp;Your journey to studying abroad begins here!
                  </p>
                </td>
              </tr>
            </table>

            <p style="font-size:14px;color:#7a736d;margin:0;">
              If you have any questions, contact us at
              <a href="mailto:brinda.mummadi@gmail.com"
                 style="color:#c0392b;text-decoration:none;">brinda.mummadi@gmail.com</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fd;border-top:1px solid #dbe1eb;
                     padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#a39c95;">
              © ${new Date().getFullYear()} Edmissions World. All rights reserved.<br/>
              This is an automated confirmation. Please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Edmissions World" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `✅ Form Submitted Successfully – Reference ${refCode} | Edmissions World`,
    html,
  });

  console.log(`✅ Student confirmation email sent to: ${email}`);
}

// ─── Admin Notification Email (Full Details) ──────────────────────────────────────
async function sendAdminNotification(submission) {
  // Always send to brinda.mummadi@gmail.com (or override via .env)
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'brinda.mummadi@gmail.com';

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Email not configured – skipping admin notification email.');
    return;
  }

  const transporter = createTransporter();
  const refCode = `#${String(submission.id).padStart(4, '0')}`;

  // Full IST timestamp
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    second:  '2-digit',
    hour12:  true,
  });

  // Build qualifications rows
  const quals = Array.isArray(submission.qualifications) ? submission.qualifications : [];
  let qualRows = '';
  if (quals.length === 0) {
    qualRows = `<tr><td colspan="2" style="padding:11px 18px;font-size:13px;color:#a39c95;
      border-bottom:1px solid #dbe1eb;font-style:italic;">No qualifications entered</td></tr>`;
  } else {
    quals.forEach((q, i) => {
      const shade = i % 2 === 0;
      qualRows += row(
        `Qualification ${i + 1}`,
        [
          q.qualification && `<strong>${q.qualification}</strong>`,
          q.university    && `University: ${q.university}`,
          q.course        && `Course: ${q.course}`,
          q.percent       && `Marks: ${q.percent}%`,
          q.year_of_passing && `Year: ${q.year_of_passing}`,
          q.class         && `Class: ${q.class}`,
          q.medium        && `Medium: ${q.medium}`,
          q.backlogs      && `Backlogs: ${q.backlogs}`,
        ].filter(Boolean).join(' &nbsp;·&nbsp; '),
        shade,
      );
    });
  }

  // Build heard-about string
  const heardSources = [
    submission.heard_friends        && 'Friends',
    submission.heard_internet       && 'Internet',
    submission.heard_tele_calling   && 'Tele Calling',
    submission.heard_brand_reference && 'Brand Reference',
    submission.heard_mobile_sms     && 'Mobile SMS',
    submission.heard_whatsapp       && 'WhatsApp',
  ].filter(Boolean).join(', ') || '—';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Form Submitted – Edmissions World</title>
</head>
<body style="margin:0;padding:0;background:#e9eff5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e9eff5;padding:40px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0"
             style="max-width:640px;width:100%;background:#fff;border-radius:16px;
                    overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">

        <!-- ══ HEADER ══ -->
        <tr>
          <td colspan="2"
              style="background:linear-gradient(135deg,#162238 0%,#c0392b 100%);
                     padding:28px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;
                      color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:2px;">
              Form Submitted
            </p>
            <h1 style="margin:0;font-size:22px;color:#fff;font-weight:800;letter-spacing:1px;">
              Edmissions World
            </h1>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);">
              New Walk-In Form Submission Alert
            </p>
          </td>
        </tr>

        <!-- ══ BANNER ══ -->
        <tr>
          <td colspan="2" style="background:#eafaf1;padding:16px 40px;text-align:center;
                                  border-bottom:2px solid #c0392b;">
            <p style="margin:0;font-size:15px;color:#1a5c35;font-weight:600;">
              📋 &nbsp;A new study abroad walk-in form has been submitted.
            </p>
          </td>
        </tr>

        <!-- ══ META ══ -->
        <tr>
          <td colspan="2" style="padding:24px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1.5px solid #dbe1eb;border-radius:10px;overflow:hidden;
                          margin-bottom:4px;">
              ${row('Reference ID',   `<span style="font-size:16px;font-weight:800;font-family:monospace;color:#162238;letter-spacing:2px;">${refCode}</span>`, true)}
              ${row('Submitted At',   `<strong>${submittedAt} IST</strong>`, false)}
            </table>
          </td>
        </tr>

        <!-- ══ ALL DETAILS ══ -->
        <tr>
          <td colspan="2" style="padding:20px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1.5px solid #dbe1eb;border-radius:10px;overflow:hidden;">

              ${sectionHeader('👤 Personal Information')}
              ${row('Full Name',        `${submission.first_name} ${submission.last_name}`, true)}
              ${row('Gender',           submission.gender, false)}
              ${row('Date of Birth',    submission.dob, true)}
              ${row('Email',            submission.email, false)}
              ${row('Mobile',           submission.mobile, true)}
              ${row('Passport',         bool(submission.has_passport), false)}
              ${row('Passport Number',  submission.passport_number, true)}
              ${row('Date of Form',     submission.date, false)}

              ${sectionHeader('👨‍👩‍👦 Family Information')}
              ${row('Father Name',          submission.father_name, true)}
              ${row('Father Occupation',    submission.father_occupation, false)}
              ${row('Father Contact',       submission.father_contact, true)}
              ${row('Mother Name',          submission.mother_name, false)}
              ${row('Mother Occupation',    submission.mother_occupation, true)}
              ${row('Mother Contact',       submission.mother_contact, false)}
              ${row('Sibling 1',            submission.sibling1_name
                                              ? `${submission.sibling1_name} (${val(submission.sibling1_edujob)})`
                                              : null, true)}
              ${row('Sibling 2',            submission.sibling2_name
                                              ? `${submission.sibling2_name} (${val(submission.sibling2_edujob)})`
                                              : null, false)}
              ${row('Family Annual Income', submission.family_annual_income, true)}
              ${row('Address',              submission.address, false)}

              ${sectionHeader('🎓 Academic Qualifications')}
              ${qualRows}

              ${sectionHeader('🌍 Study Preferences')}
              ${row('English Test',          bool(submission.english_test), true)}
              ${row('English Test Marks',    submission.english_test_marks, false)}
              ${row('English Test Remarks',  submission.english_test_remarks, true)}
              ${row('Country – UK',          bool(submission.country_uk), false)}
              ${row('Country – Other',       submission.country_other, true)}
              ${row('Preferred University',  submission.university_preferred, false)}

              ${sectionHeader('📣 How Did They Hear About Us')}
              ${row('Sources', heardSources, true)}

              ${sectionHeader('📞 References')}
              ${row('Ref 1 Name',      submission.ref1_name, true)}
              ${row('Ref 1 Contact',   submission.ref1_contact, false)}
              ${row('Ref 1 Attended',  submission.ref1_attended, true)}
              ${row('Ref 2 Name',      submission.ref2_name, false)}
              ${row('Ref 2 Contact',   submission.ref2_contact, true)}
              ${row('Ref 2 Attended',  submission.ref2_attended, false)}

            </table>
          </td>
        </tr>

        <!-- ══ DASHBOARD LINK ══ -->
        <tr>
          <td colspan="2" style="padding:28px 40px;">
            <a href="http://localhost:${process.env.PORT || 3000}/admin-records.html"
               style="display:inline-block;
                      background:linear-gradient(135deg,#162238 0%,#c0392b 100%);
                      color:#fff;text-decoration:none;padding:13px 32px;
                      border-radius:8px;font-size:14px;font-weight:700;
                      letter-spacing:0.3px;">
              View in Admin Dashboard →
            </a>
          </td>
        </tr>

        <!-- ══ FOOTER ══ -->
        <tr>
          <td colspan="2"
              style="background:#f8f9fd;border-top:1px solid #dbe1eb;
                     padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#a39c95;">
              © ${new Date().getFullYear()} Edmissions World. Automated admin notification. Do not reply.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from:    `"Edmissions World" <${process.env.GMAIL_USER}>`,
    to:      adminEmail,
    subject: `📋 Form Submitted – ${submission.first_name} ${submission.last_name} (${refCode}) | Edmissions World`,
    html,
  });

  console.log(`✅ Admin notification email sent to: ${adminEmail}`);
}

module.exports = { sendStudentConfirmation, sendAdminNotification };
