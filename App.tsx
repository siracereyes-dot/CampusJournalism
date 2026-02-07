
import React, { useState, useMemo } from 'react';
import Swal from 'https://esm.sh/sweetalert2@11';
import { 
  CandidateInfo, 
  ScoringState, 
  AcademicScore, 
  ContestScore, 
  SpecialAwardScore, 
  PublicationLeadership,
  GuildLeadership,
  InnovationScore,
  CommunityService,
  PublishedWorks,
  TrainingScore,
  InterviewScore
} from './types';
import { SCORING_CONSTANTS, RANK_MAP, DEPED_NCR_DIVISIONS } from './constants';

const initialState: ScoringState = {
  info: { division: '', school: '', name: '' },
  academic: { rank: 'None', points: 0 },
  individualContests: { level: 'None', rank: 'None', points: 0 },
  groupContests: { level: 'None', rank: 'None', points: 0 },
  specialAwards: { level: 'None', rank: 'None', points: 0 },
  pubLeadership: { position: 'None', points: 0 },
  guildLeadership: { position: 'None', level: 'None', points: 0 },
  innovation: { level: 'None', points: 0 },
  communityService: { role: 'None', level: 'None', points: 0 },
  publishedWorks: { level: 'None', points: 0 },
  trainings: { level: 'None', points: 0 },
  interview: {
    journalismPrinciples: 0,
    leadershipPotential: 0,
    experienceEngagement: 0,
    commitmentGrowth: 0,
    communicationSkills: 0,
  }
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6 border-b border-slate-200 pb-2">
    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{title}</h2>
    {subtitle && <p className="text-sm text-slate-500 italic mt-1">{subtitle}</p>}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8 card ${className}`}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [data, setData] = useState<ScoringState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedCandidates, setSubmittedCandidates] = useState<string[]>([]);
  
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyUz-D9I7QDYTbaZfFSQd9yt3oOO-Ai9rPA5xofkUOPJs39S_9e7DbjT5s-_JwDiEjGxQ/exec';

  const interviewTotal = useMemo(() => {
    return (Object.values(data.interview) as number[]).reduce((a, b) => a + b, 0);
  }, [data.interview]);

  const grandTotal = useMemo(() => {
    return (
      data.academic.points +
      data.individualContests.points +
      data.groupContests.points +
      data.specialAwards.points +
      data.pubLeadership.points +
      data.guildLeadership.points +
      data.innovation.points +
      data.communityService.points +
      data.publishedWorks.points +
      data.trainings.points +
      interviewTotal
    );
  }, [data, interviewTotal]);

  const handleInfoChange = (field: keyof CandidateInfo, value: string) => {
    setData(prev => ({ ...prev, info: { ...prev.info, [field]: value } }));
  };

  const handleAcademicChange = (rank: AcademicScore['rank']) => {
    setData(prev => ({ 
      ...prev, 
      academic: { rank, points: SCORING_CONSTANTS.ACADEMIC[rank] } 
    }));
  };

  const calculateContestPoints = (level: ContestScore['level'], rank: ContestScore['rank']) => {
    if (level === 'None' || rank === 'None') return 0;
    const rankIndex = RANK_MAP[rank];
    return SCORING_CONSTANTS.CONTESTS[level][rankIndex] || 0;
  };

  const calculateSpecialPoints = (level: SpecialAwardScore['level'], rank: SpecialAwardScore['rank']) => {
    if (level === 'None' || rank === 'None') return 0;
    const rankIndex = RANK_MAP[rank];
    return SCORING_CONSTANTS.SPECIAL_AWARDS[level][rankIndex] || 0;
  };

  const handleContestChange = (type: 'individualContests' | 'groupContests', field: 'level' | 'rank', value: any) => {
    setData(prev => {
      const updated = { ...prev[type], [field]: value };
      updated.points = calculateContestPoints(updated.level, updated.rank);
      return { ...prev, [type]: updated };
    });
  };

  const handleSpecialAwardChange = (field: 'level' | 'rank', value: any) => {
    setData(prev => {
      const updated = { ...prev.specialAwards, [field]: value };
      updated.points = calculateSpecialPoints(updated.level, updated.rank);
      return { ...prev, specialAwards: updated };
    });
  };

  const handlePubLeadershipChange = (pos: PublicationLeadership['position']) => {
    setData(prev => ({
      ...prev,
      pubLeadership: { position: pos, points: SCORING_CONSTANTS.PUB_LEADERSHIP[pos] }
    }));
  };

  const handleGuildLeadershipChange = (field: 'position' | 'level', value: any) => {
    setData(prev => {
      const updated = { ...prev.guildLeadership, [field]: value };
      let points = 0;
      if (updated.position !== 'None' && updated.level !== 'None') {
        points = (SCORING_CONSTANTS.GUILD_LEADERSHIP as any)[updated.position][updated.level] || 0;
      }
      return { ...prev, guildLeadership: { ...updated, points } };
    });
  };

  const handleInnovationChange = (level: InnovationScore['level']) => {
    setData(prev => ({
      ...prev,
      innovation: { level, points: SCORING_CONSTANTS.INNOVATIONS[level] }
    }));
  };

  const handleCommunityChange = (field: 'role' | 'level', value: any) => {
    setData(prev => {
      const updated = { ...prev.communityService, [field]: value };
      let points = 0;
      if (updated.role !== 'None' && updated.level !== 'None') {
        points = (SCORING_CONSTANTS.COMMUNITY as any)[updated.role][updated.level] || 0;
      }
      return { ...prev, communityService: { ...updated, points } };
    });
  };

  const handlePublishedWorksChange = (level: PublishedWorks['level']) => {
    setData(prev => ({
      ...prev,
      publishedWorks: { level, points: SCORING_CONSTANTS.PUBLISHED_WORKS[level] }
    }));
  };

  const handleTrainingsChange = (level: TrainingScore['level']) => {
    setData(prev => ({
      ...prev,
      trainings: { level, points: SCORING_CONSTANTS.TRAININGS[level] }
    }));
  };

  const handleInterviewChange = (field: keyof InterviewScore, value: string) => {
    const val = parseFloat(value) || 0;
    const capped = Math.min(2, Math.max(0, val));
    setData(prev => ({
      ...prev,
      interview: { ...prev.interview, [field]: capped }
    }));
  };

  const resetForm = () => {
    setData(initialState);
    setSubmitStatus('idle');
  };

  const submitToDatabase = async () => {
    const candidateName = data.info.name.trim();
    const schoolName = data.info.school.trim();
    const divisionName = data.info.division.trim();

    // Check all required fields
    if (!divisionName || !schoolName || !candidateName) {
      const missing = [];
      if (!divisionName) missing.push("Division");
      if (!schoolName) missing.push("School");
      if (!candidateName) missing.push("Candidate Name");

      Swal.fire({
        icon: 'warning',
        title: 'Required Information',
        text: `Please provide: ${missing.join(", ")} before saving.`,
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    const candidateKey = `${candidateName}|${schoolName}|${divisionName}`.toLowerCase();
    if (submittedCandidates.includes(candidateKey)) {
      const result = await Swal.fire({
        icon: 'info',
        title: 'Duplicate Detected',
        text: `The candidate "${candidateName}" from this school and division has already been saved in this session. Do you want to save it again?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, Save Again',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#94a3b8'
      });

      if (!result.isConfirmed) return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    Swal.fire({
      title: 'Saving...',
      text: 'Synchronizing with database',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const payload = {
      name: candidateName,
      school: schoolName,
      division: divisionName,
      academic: data.academic.points,
      individual: data.individualContests.points,
      group: data.groupContests.points,
      special: data.specialAwards.points,
      pubLead: data.pubLeadership.points,
      guildLead: data.guildLeadership.points,
      innovation: data.innovation.points,
      community: data.communityService.points,
      published: data.publishedWorks.points,
      trainings: data.trainings.points,
      interviewTotal: interviewTotal,
      grandTotal: grandTotal.toFixed(2),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitStatus('success');
      setSubmittedCandidates(prev => [...prev, candidateKey]);

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: `Scores for ${candidateName} have been recorded.`,
        timer: 2000,
        showConfirmButton: false
      });

      setData(initialState);
      
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitStatus('error');
      
      Swal.fire({
        icon: 'error',
        title: 'Sync Failed',
        text: 'There was an error saving the data. Please check your connection.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualReset = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will clear all current scores and information.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        Swal.fire({
          title: 'Cleared!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
          Search for Outstanding Campus Journalists
        </h1>
        <p className="text-slate-500 font-medium italic">Official Digital Scoring Sheet (Google Sheets Integrated)</p>
        <div className="mt-4 flex justify-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Session History: {submittedCandidates.length} Saved
          </span>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              Division <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 transition-colors bg-transparent cursor-pointer"
              value={data.info.division}
              onChange={e => handleInfoChange('division', e.target.value)}
            >
              <option value="">Select Division (NCR)</option>
              {DEPED_NCR_DIVISIONS.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              School <span className="text-red-500">*</span>
            </label>
            <input 
              className="w-full border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 transition-colors bg-transparent"
              value={data.info.school}
              onChange={e => handleInfoChange('school', e.target.value)}
              placeholder="Enter School"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              Candidate Name <span className="text-red-500">*</span>
            </label>
            <input 
              className="w-full border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 transition-colors bg-transparent font-semibold"
              value={data.info.name}
              onChange={e => handleInfoChange('name', e.target.value)}
              placeholder="Enter Full Name"
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="A. Academic Standing" subtitle="In all learning areas (latest grading period)" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(SCORING_CONSTANTS.ACADEMIC).map(([rank, pts]) => (
            <button
              key={rank}
              onClick={() => handleAcademicChange(rank as any)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                data.academic.rank === rank 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              <div>{rank}</div>
              <div className="text-xs opacity-70">{pts} Points</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Achievements in Campus Journalism" subtitle="Individual & Group Contests" />
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">1. Individual Contests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={data.individualContests.level}
                onChange={e => handleContestChange('individualContests', 'level', e.target.value)}
              >
                <option value="None">Select Level</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Division">Division</option>
              </select>
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={data.individualContests.rank}
                onChange={e => handleContestChange('individualContests', 'rank', e.target.value)}
              >
                <option value="None">Select Rank</option>
                <option value="1ST">1st Place</option>
                <option value="2ND">2nd Place</option>
                <option value="3RD">3rd Place</option>
                <option value="4TH">4th Place</option>
                <option value="5TH">5th Place</option>
              </select>
            </div>
            <div className="mt-2 text-right">
              <span className="text-sm text-slate-500">Earned: </span>
              <span className="font-bold text-blue-600">{data.individualContests.points} Points</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">2. Group Contests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={data.groupContests.level}
                onChange={e => handleContestChange('groupContests', 'level', e.target.value)}
              >
                <option value="None">Select Level</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Division">Division</option>
              </select>
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={data.groupContests.rank}
                onChange={e => handleContestChange('groupContests', 'rank', e.target.value)}
              >
                <option value="None">Select Rank</option>
                <option value="1ST">1st Place</option>
                <option value="2ND">2nd Place</option>
                <option value="3RD">3rd Place</option>
                <option value="4TH">4th Place</option>
                <option value="5TH">5th Place</option>
              </select>
            </div>
            <div className="mt-2 text-right">
              <span className="text-sm text-slate-500">Earned: </span>
              <span className="font-bold text-blue-600">{data.groupContests.points} Points</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Special Awards in Group Contests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={data.specialAwards.level}
                onChange={e => handleSpecialAwardChange('level', e.target.value)}
              >
                <option value="None">Select Level</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Division">Division</option>
              </select>
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={data.specialAwards.rank}
                onChange={e => handleSpecialAwardChange('rank', e.target.value)}
              >
                <option value="None">Select Rank</option>
                <option value="1ST">1st Place</option>
                <option value="2ND">2nd Place</option>
                <option value="3RD">3rd Place</option>
                <option value="4TH">4th Place</option>
                <option value="5TH">5th Place</option>
              </select>
            </div>
            <div className="mt-2 text-right">
              <span className="text-sm text-slate-500">Earned: </span>
              <span className="font-bold text-blue-600">{data.specialAwards.points} Points</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Leadership, Innovations, and Published Works" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">School Publication Position</h3>
            <select 
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50"
              value={data.pubLeadership.position}
              onChange={e => handlePubLeadershipChange(e.target.value as any)}
            >
              <option value="None">None</option>
              {Object.keys(SCORING_CONSTANTS.PUB_LEADERSHIP).filter(k => k !== 'None').map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Editors' Guild Leadership</h3>
            <div className="grid grid-cols-2 gap-2">
              <select 
                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                value={data.guildLeadership.position}
                onChange={e => handleGuildLeadershipChange('position', e.target.value)}
              >
                <option value="None">Position</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Other positions recognized by DepEd">Other</option>
              </select>
              <select 
                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                value={data.guildLeadership.level}
                onChange={e => handleGuildLeadershipChange('level', e.target.value)}
              >
                <option value="None">Level</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Division">Division</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Innovations and Advocacies</h3>
            <select 
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50"
              value={data.innovation.level}
              onChange={e => handleInnovationChange(e.target.value as any)}
            >
              <option value="None">None</option>
              <option value="National">National (30 pts)</option>
              <option value="Regional">Regional (25 pts)</option>
              <option value="Division">Division (20 pts)</option>
              <option value="District">District (15 pts)</option>
              <option value="School">School (10 pts)</option>
            </select>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Published Works</h3>
            <select 
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50"
              value={data.publishedWorks.level}
              onChange={e => handlePublishedWorksChange(e.target.value as any)}
            >
              <option value="None">None</option>
              <option value="National">National/Local Dailies (5 pts)</option>
              <option value="Regional">Regional (3 pts)</option>
              <option value="Division">Division (1 pt)</option>
            </select>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Community & Extension Services</h3>
            <div className="grid grid-cols-2 gap-2">
              <select 
                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                value={data.communityService.role}
                onChange={e => handleCommunityChange('role', e.target.value)}
              >
                <option value="None">Role</option>
                <option value="COMMITTEE CHAIRPERSON">Chairperson</option>
                <option value="FACILITATOR">Facilitator</option>
              </select>
              <select 
                className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                value={data.communityService.level}
                onChange={e => handleCommunityChange('level', e.target.value)}
              >
                <option value="None">Level</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Division">Division</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Trainings Attended (DepEd Recognized)</h3>
            <select 
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50"
              value={data.trainings.level}
              onChange={e => handleTrainingsChange(e.target.value as any)}
            >
              <option value="None">None</option>
              <option value="National">National (5 pts)</option>
              <option value="Regional">Regional (4 pts)</option>
              <option value="Division">Division (3 pts)</option>
              <option value="School/District">School/District (2 pts)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Panel Interview" subtitle="10 Points Total (Max 2 pts per category)" />
        <div className="space-y-4">
          {[
            { id: 'journalismPrinciples', label: 'Journalism Principles and Ethics' },
            { id: 'leadershipPotential', label: 'Leadership / Mentorship Potential' },
            { id: 'experienceEngagement', label: 'Experience and Engagement in Campus Journalism' },
            { id: 'commitmentGrowth', label: 'Commitment to Growth and Learning' },
            { id: 'communicationSkills', label: 'Communication Skills' },
          ].map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100 gap-4">
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  className="w-24 p-2 rounded border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.interview[item.id as keyof InterviewScore]}
                  onChange={e => handleInterviewChange(item.id as any, e.target.value)}
                />
                <span className="text-xs text-slate-400">/ 2.0</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl p-4 no-print z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden lg:block">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Current Candidate</p>
              {submitStatus === 'success' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Waiting for next...</span>}
            </div>
            <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{data.info.name || 'Ready for entry'}</p>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Grand Total</p>
              <p className="text-2xl md:text-3xl font-black text-blue-600 tracking-tighter leading-none">{grandTotal.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={submitToDatabase}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 md:px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  isSubmitting 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                }`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                )}
                <span className="font-bold">{isSubmitting ? 'Saving...' : 'Save'}</span>
              </button>

              <button 
                onClick={handleManualReset}
                className="bg-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-300 transition-colors"
                title="Clear Form"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32"></div>
    </div>
  );
};

export default App;
