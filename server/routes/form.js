const express = require('express');
const Submission = require('../models/submission');
const { sendStudentConfirmation, sendAdminNotification } = require('../utils/emailService');

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const data = req.body;

    if (!data.first_name || !data.first_name.trim()) {
      return res.status(400).json({ success: false, message: 'First name is required.' });
    }
    if (!data.last_name || !data.last_name.trim()) {
      return res.status(400).json({ success: false, message: 'Last name is required.' });
    }

    if (data.email && data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
      }
    }

    const qualifications = [];
    if (data.qualifications && Array.isArray(data.qualifications)) {
      data.qualifications.forEach((q) => {
        const hasContent = Object.values(q).some((v) => v && v.toString().trim());
        if (hasContent) {
          qualifications.push({
            qualification: q.qualification || '',
            university: q.university || '',
            course: q.course || '',
            percent: q.percent || '',
            year_of_passing: q.year_of_passing || '',
            class: q.class || '',
            medium: q.medium || '',
            backlogs: q.backlogs || '',
          });
        }
      });
    }

    const submission = await Submission.create({
      date: data.date || null,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      gender: data.gender || null,
      dob: data.dob || null,
      email: data.email ? data.email.trim() : null,
      mobile: data.mobile || null,
      has_passport: data.has_passport === 'true' || data.has_passport === true,
      passport_number: data.passport_number || null,
      father_name: data.father_name || null,
      mother_name: data.mother_name || null,
      father_occupation: data.father_occupation || null,
      mother_occupation: data.mother_occupation || null,
      father_contact: data.father_contact || null,
      mother_contact: data.mother_contact || null,
      sibling1_name: data.sibling1_name || null,
      sibling1_edujob: data.sibling1_edujob || null,
      sibling2_name: data.sibling2_name || null,
      sibling2_edujob: data.sibling2_edujob || null,
      family_annual_income: data.family_annual_income || null,
      address: data.address || null,
      qualifications,
      english_test: data.english_test === 'true' || data.english_test === true,
      english_test_marks: data.english_test_marks || null,
      english_test_remarks: data.english_test_remarks || null,
      country_uk: data.country_uk === true || data.country_uk === 'true',
      country_other: data.country_other || null,
      university_preferred: data.university_preferred || null,
      heard_friends: data.heard_friends === true || data.heard_friends === 'true',
      heard_internet: data.heard_internet === true || data.heard_internet === 'true',
      heard_tele_calling: data.heard_tele_calling === true || data.heard_tele_calling === 'true',
      heard_brand_reference: data.heard_brand_reference === true || data.heard_brand_reference === 'true',
      heard_mobile_sms: data.heard_mobile_sms === true || data.heard_mobile_sms === 'true',
      heard_whatsapp: data.heard_whatsapp === true || data.heard_whatsapp === 'true',
      ref1_name: data.ref1_name || null,
      ref1_contact: data.ref1_contact || null,
      ref1_attended: data.ref1_attended || null,
      ref1_signature: data.ref1_signature || null,
      ref2_name: data.ref2_name || null,
      ref2_contact: data.ref2_contact || null,
      ref2_attended: data.ref2_attended || null,
      ref2_signature: data.ref2_signature || null,
    });

    // ── Send confirmation emails (non-blocking) ───────────────────────────────
    Promise.allSettled([
      sendStudentConfirmation({
        firstName: submission.first_name,
        lastName:  submission.last_name,
        email:     submission.email,
        refId:     submission.id,
      }),
      sendAdminNotification(submission.toJSON()),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === 'rejected') {
          console.error('Email send error:', r.reason);
        }
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Form submitted successfully!',
      id: submission.id,
    });
  } catch (err) {
    console.error('Form submission error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
