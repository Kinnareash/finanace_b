import { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {

  const { user, logout, updateProfile, isLoading, deleteAccount } = useAuth();
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/70">
          Manage your account and application preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl shadow-xl">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-400" />
              Profile Information
            </h3>
          </div>
          <div className="p-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setErrorMsg('');
                setSuccessMsg('');
                try {
                  await updateProfile(editName, editEmail);
                  setSuccessMsg('Profile updated successfully!');
                  setEditMode(false);
                } catch (err: any) {
                  setErrorMsg(err.message || 'Failed to update profile');
                }
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white">Full Name</label>
                  <input
                    type="text"
                    value={editMode ? editName : user?.name || ''}
                    onChange={e => setEditName(e.target.value)}
                    readOnly={!editMode}
                    className={`mt-1 block w-full rounded-xl border border-white/20 ${editMode ? 'bg-white/10 text-white placeholder-white/50' : 'bg-white/5 text-white/70'} backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none sm:text-sm px-3 py-2 transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Email Address</label>
                  <input
                    type="email"
                    value={editMode ? editEmail : user?.email || ''}
                    onChange={e => setEditEmail(e.target.value)}
                    readOnly={!editMode}
                    className={`mt-1 block w-full rounded-xl border border-white/20 ${editMode ? 'bg-white/10 text-white placeholder-white/50' : 'bg-white/5 text-white/70'} backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none sm:text-sm px-3 py-2 transition-all duration-200`}
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2 items-center">
                {editMode ? (
                  <>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 shadow-lg"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditMode(false); setEditName(user?.name || ''); setEditEmail(user?.email || ''); setErrorMsg(''); setSuccessMsg(''); }}
                      className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 shadow-lg"
                  >
                    Update Profile
                  </button>
                )}
                {successMsg && <span className="text-green-400 ml-4">{successMsg}</span>}
                {errorMsg && <span className="text-red-400 ml-4">{errorMsg}</span>}
              </div>
            </form>
          </div>
        </div>



        {/* Delete Account Only */}
        <div className="bg-white/5 border border-red-500/30 rounded-2xl backdrop-blur-sm">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Delete Account</h3>
              <p className="text-sm text-white/70">Permanently delete your account and data</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
                setErrorMsg('');
                setSuccessMsg('');
                try {
                  await deleteAccount();
                  setSuccessMsg('Account deleted.');
                } catch (err: any) {
                  setErrorMsg(err.message || 'Failed to delete account');
                }
              }}
              className="inline-flex items-center px-3 py-1.5 border border-red-400/50 text-xs font-medium rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 backdrop-blur-sm"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <div className="p-6 flex justify-center">
            <button
              onClick={logout}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 shadow-lg"
              style={{ minWidth: 120 }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;