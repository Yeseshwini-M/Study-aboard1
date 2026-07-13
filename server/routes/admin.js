const express = require('express');
const { Op } = require('sequelize');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');
const Submission = require('../models/submission');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/stats', async (req, res) => {
  try {
    const total = await Submission.count();
    return res.json({ success: true, total });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

router.get('/submissions', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const allowedSortColumns = ['id', 'first_name', 'last_name', 'email', 'mobile', 'gender', 'dob', 'created_at'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';

    const where = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { mobile: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Submission.findAndCountAll({
      where,
      order: [[safeSortBy, sortOrder]],
      limit,
      offset,
    });

    return res.json({
      success: true,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      limit,
      data: rows,
    });
  } catch (err) {
    console.error('Submissions list error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching submissions.' });
  }
});

router.get('/submissions/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }
    return res.json({ success: true, data: submission });
  } catch (err) {
    console.error('Submission detail error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching submission.' });
  }
});

router.put('/submissions/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }
    await submission.update(req.body);
    return res.json({ success: true, message: 'Submission updated successfully.', data: submission });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ success: false, message: 'Error updating submission.' });
  }
});

router.delete('/submissions/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }
    await submission.destroy();
    return res.json({ success: true, message: 'Submission deleted.' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ success: false, message: 'Error deleting submission.' });
  }
});

function flattenSubmission(s) {
  const d = s.toJSON ? s.toJSON() : s;
  const quals = Array.isArray(d.qualifications) ? d.qualifications : [];

  const qualFields = {};
  for (let i = 0; i < 3; i++) {
    const q = quals[i] || {};
    const prefix = `qual${i + 1}`;
    qualFields[`${prefix}_qualification`] = q.qualification || '';
    qualFields[`${prefix}_university`] = q.university || '';
    qualFields[`${prefix}_course`] = q.course || '';
    qualFields[`${prefix}_percent`] = q.percent || '';
    qualFields[`${prefix}_year_of_passing`] = q.year_of_passing || '';
    qualFields[`${prefix}_class`] = q.class || '';
    qualFields[`${prefix}_medium`] = q.medium || '';
    qualFields[`${prefix}_backlogs`] = q.backlogs || '';
  }

  return {
    ID: d.id,
    Date: d.date || '',
    'First Name': d.first_name || '',
    'Last Name': d.last_name || '',
    Gender: d.gender || '',
    'Date of Birth': d.dob || '',
    Email: d.email || '',
    Mobile: d.mobile || '',
    'Has Passport': d.has_passport ? 'Yes' : 'No',
    'Passport No': d.passport_number || '',
    'Father Name': d.father_name || '',
    'Father Occupation': d.father_occupation || '',
    'Father Contact': d.father_contact || '',
    'Mother Name': d.mother_name || '',
    'Mother Occupation': d.mother_occupation || '',
    'Mother Contact': d.mother_contact || '',
    'Sibling 1 Name': d.sibling1_name || '',
    'Sibling 1 Edu/Job': d.sibling1_edujob || '',
    'Sibling 2 Name': d.sibling2_name || '',
    'Sibling 2 Edu/Job': d.sibling2_edujob || '',
    'Family Annual Income': d.family_annual_income || '',
    Address: d.address || '',
    ...qualFields,
    'English Test': d.english_test ? 'Yes' : 'No',
    'English Test Marks': d.english_test_marks || '',
    'English Test Remarks': d.english_test_remarks || '',
    'Country UK': d.country_uk ? 'Yes' : 'No',
    'Country Other': d.country_other || '',
    'University Preferred': d.university_preferred || '',
    'Heard: Friends': d.heard_friends ? 'Yes' : 'No',
    'Heard: Internet': d.heard_internet ? 'Yes' : 'No',
    'Heard: Tele Calling': d.heard_tele_calling ? 'Yes' : 'No',
    'Heard: Brand Reference': d.heard_brand_reference ? 'Yes' : 'No',
    'Heard: Mobile SMS': d.heard_mobile_sms ? 'Yes' : 'No',
    'Heard: WhatsApp': d.heard_whatsapp ? 'Yes' : 'No',
    'Ref1 Name': d.ref1_name || '',
    'Ref1 Contact': d.ref1_contact || '',
    'Ref1 Attended': d.ref1_attended || '',
    'Ref1 Signature': d.ref1_signature || '',
    'Ref2 Name': d.ref2_name || '',
    'Ref2 Contact': d.ref2_contact || '',
    'Ref2 Attended': d.ref2_attended || '',
    'Ref2 Signature': d.ref2_signature || '',
    'Created At': d.created_at || '',
    'Updated At': d.updated_at || '',
  };
}

router.get('/export/csv', async (req, res) => {
  try {
    const submissions = await Submission.findAll({ order: [['created_at', 'DESC']] });
    const data = submissions.map(flattenSubmission);

    if (data.length === 0) {
      return res.status(404).json({ success: false, message: 'No data to export.' });
    }

    const parser = new Parser({ fields: Object.keys(data[0]) });
    const csv = parser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="submissions_${Date.now()}.csv"`);
    return res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({ success: false, message: 'Error exporting CSV.' });
  }
});

router.get('/export/excel', async (req, res) => {
  try {
    const submissions = await Submission.findAll({ order: [['created_at', 'DESC']] });
    const data = submissions.map(flattenSubmission);

    if (data.length === 0) {
      return res.status(404).json({ success: false, message: 'No data to export.' });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    const colWidths = Object.keys(data[0]).map((key) => ({ wch: Math.max(key.length, 15) }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="submissions_${Date.now()}.xlsx"`);
    return res.send(buffer);
  } catch (err) {
    console.error('Excel export error:', err);
    return res.status(500).json({ success: false, message: 'Error exporting Excel.' });
  }
});

module.exports = router;
