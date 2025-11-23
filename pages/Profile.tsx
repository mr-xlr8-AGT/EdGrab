import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, Mail, School, GraduationCap, Save, LogOut, Camera, Check } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [showSaved, setShowSaved] = useState(false);

  // Sync if user prop updates externally
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic validation could go here
    onUpdateUser(formData);
    setIsEditing(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const regenerateAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setFormData(prev => ({
      ...prev,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newSeed}`
    }));
  };

  return (
    <div className="p-6 md:p-8 bg-black h-full text-white pb-32 overflow-y-auto custom-scrollbar">
       {/* Header */}
       <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-zinc-400 text-sm mt-1">Manage your personal information and settings.</p>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            <LogOut size={16} /> Sign Out
          </button>
       </div>

       <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-edgrab-accent/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

             <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                   <div className="relative group">
                      <div className="w-32 h-32 rounded-full border-4 border-zinc-800 overflow-hidden shadow-2xl bg-zinc-900">
                         <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      {isEditing && (
                        <button 
                          onClick={regenerateAvatar}
                          className="absolute bottom-0 right-0 p-2 bg-edgrab-accent text-black rounded-full hover:bg-white transition-colors shadow-lg"
                          title="Generate New Avatar"
                        >
                          <Camera size={16} />
                        </button>
                      )}
                   </div>
                   {!isEditing && (
                     <div className="text-center">
                        <div className="text-xl font-bold">{user.firstName} {user.lastName}</div>
                        <div className="text-zinc-500 text-sm">{user.school}</div>
                     </div>
                   )}
                </div>

                {/* Form Section */}
                <div className="flex-1 w-full space-y-6">
                   <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                      <h3 className="text-lg font-semibold">Personal Details</h3>
                      {!isEditing ? (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-edgrab-accent hover:text-white transition-colors font-medium"
                        >
                          Edit Details
                        </button>
                      ) : (
                        <div className="flex gap-3">
                           <button 
                              onClick={() => {
                                setFormData(user);
                                setIsEditing(false);
                              }}
                              className="text-sm text-zinc-500 hover:text-white transition-colors"
                           >
                             Cancel
                           </button>
                           <button 
                              onClick={handleSave}
                              className="flex items-center gap-2 px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors"
                           >
                             <Save size={14} /> Save
                           </button>
                        </div>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">First Name</label>
                         <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-black border-zinc-700 focus-within:border-edgrab-accent' : 'bg-transparent border-transparent'}`}>
                            <User size={18} className="text-zinc-600" />
                            <input 
                              disabled={!isEditing}
                              value={formData.firstName}
                              onChange={(e) => handleChange('firstName', e.target.value)}
                              className="bg-transparent w-full focus:outline-none disabled:text-zinc-300"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Last Name</label>
                         <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-black border-zinc-700 focus-within:border-edgrab-accent' : 'bg-transparent border-transparent'}`}>
                            <User size={18} className="text-zinc-600 opacity-0" />
                            <input 
                              disabled={!isEditing}
                              value={formData.lastName}
                              onChange={(e) => handleChange('lastName', e.target.value)}
                              className="bg-transparent w-full focus:outline-none disabled:text-zinc-300"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Email</label>
                         <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-transparent opacity-60 cursor-not-allowed">
                            <Mail size={18} className="text-zinc-600" />
                            <input 
                              disabled
                              value={formData.email}
                              className="bg-transparent w-full focus:outline-none text-zinc-400"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">School</label>
                         <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-black border-zinc-700 focus-within:border-edgrab-accent' : 'bg-transparent border-transparent'}`}>
                            <School size={18} className="text-zinc-600" />
                            <input 
                              disabled={!isEditing}
                              value={formData.school}
                              onChange={(e) => handleChange('school', e.target.value)}
                              className="bg-transparent w-full focus:outline-none disabled:text-zinc-300"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Grade / Year</label>
                         <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-black border-zinc-700 focus-within:border-edgrab-accent' : 'bg-transparent border-transparent'}`}>
                            <GraduationCap size={18} className="text-zinc-600" />
                            <input 
                              disabled={!isEditing}
                              value={formData.grade}
                              onChange={(e) => handleChange('grade', e.target.value)}
                              className="bg-transparent w-full focus:outline-none disabled:text-zinc-300"
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Success Toast */}
          {showSaved && (
             <div className="fixed bottom-24 md:bottom-8 right-8 bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 animate-slide-up z-50">
               <Check size={18} /> Profile Updated
             </div>
          )}
       </div>
    </div>
  );
};

export default Profile;