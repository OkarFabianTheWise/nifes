// Fixed database setup script with proper sequencing
const sqlite3 = require('sqlite3').verbose();

console.log('🔧 Setting up database...');

const db = new sqlite3.Database('./fellowship.db', (err) => {
  if (err) {
    console.error('❌ Error creating database:', err);
    process.exit(1);
  } else {
    console.log('✅ Database created successfully!');
    createTablesSequentially();
  }
});

function createTablesSequentially() {
  console.log('📋 Creating tables...');
  
  // Create members table first
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      first_scan_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating members table:', err);
      process.exit(1);
    } else {
      console.log('✅ Members table created');
      createSessionsTable();
    }
  });
}

function createSessionsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id TEXT PRIMARY KEY,
      session_name TEXT NOT NULL,
      session_date TEXT NOT NULL,
      qr_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating sessions table:', err);
      process.exit(1);
    } else {
      console.log('✅ Sessions table created');
      createAttendanceTable();
    }
  });
}

function createAttendanceTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      member_id TEXT NOT NULL,
      scan_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_first_time BOOLEAN DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES attendance_sessions (id),
      FOREIGN KEY (member_id) REFERENCES members (id),
      UNIQUE(session_id, member_id)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating attendance table:', err);
      process.exit(1);
    } else {
      console.log('✅ Attendance records table created');
      insertSampleData();
    }
  });
}

function insertSampleData() {
  console.log('📝 Adding sample members...');
  
  const members = [
    { id: 'member-1', name: 'John Doe', email: 'john@example.com', phone: '+234-801-234-5678' },
    { id: 'member-2', name: 'Mary Johnson', email: 'mary@example.com', phone: '+234-802-345-6789' },
    { id: 'member-3', name: 'David Wilson', email: 'david@example.com', phone: '+234-803-456-7890' },
    { id: 'member-4', name: 'Sarah Brown', email: 'sarah@example.com', phone: '+234-804-567-8901' },
    { id: 'member-5', name: 'Michael Davis', email: 'michael@example.com', phone: '+234-805-678-9012' }
  ];

  let completed = 0;
  const total = members.length;

  members.forEach((member, index) => {
    db.run(
      'INSERT OR REPLACE INTO members (id, name, email, phone) VALUES (?, ?, ?, ?)',
      [member.id, member.name, member.email, member.phone],
      function(err) {
        if (err) {
          console.error(`❌ Error inserting ${member.name}:`, err.message);
        } else {
          console.log(`✅ Added member: ${member.name}`);
        }
        
        completed++;
        if (completed === total) {
          createSampleSession();
        }
      }
    );
  });
}

function createSampleSession() {
  console.log('📅 Creating sample session...');
  
  const sessionId = 'session-' + Date.now();
  const qrData = `http://localhost:5000/scan/${sessionId}`;
  const today = new Date().toISOString().split('T')[0];
  
  db.run(
    'INSERT INTO attendance_sessions (id, session_name, session_date, qr_data, is_active) VALUES (?, ?, ?, ?, ?)',
    [sessionId, 'Sunday Service', today, qrData, 1],
    function(err) {
      if (err) {
        console.error('❌ Error creating sample session:', err);
      } else {
        console.log('✅ Created sample session: Sunday Service');
      }
      
      // Verify the setup
      verifySetup();
    }
  );
}

function verifySetup() {
  console.log('🔍 Verifying setup...');
  
  // Check members count
  db.get('SELECT COUNT(*) as count FROM members', (err, row) => {
    if (err) {
      console.error('❌ Error checking members:', err);
    } else {
      console.log(`✅ Found ${row.count} members in database`);
    }
    
    // Check sessions count
    db.get('SELECT COUNT(*) as count FROM attendance_sessions', (err, row) => {
      if (err) {
        console.error('❌ Error checking sessions:', err);
      } else {
        console.log(`✅ Found ${row.count} session(s) in database`);
      }
      
      // Close database
      finishSetup();
    });
  });
}

function finishSetup() {
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err);
    } else {
      console.log('🎉 Database setup completed successfully!');
      console.log('📁 Database file: fellowship.db');
      console.log('🚀 You can now start your server with: npm run dev');
    }
    process.exit(0);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Setup interrupted');
  db.close();
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  db.close();
  process.exit(1);
});