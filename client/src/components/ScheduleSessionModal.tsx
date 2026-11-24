import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, LoaderIcon, SparklesIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { SKILLS } from "../constants/constantsCollection";
import { createSessionFn } from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeUser } from "../types/typesCollection";

// schedule session modal props type
type ScheduleSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialPartner?: typeUser | null;
  friends?: typeUser[];
};

// schedule study session modal component
const ScheduleSessionModal = ({
  isOpen,
  onClose,
  initialPartner,
  friends = [],
}: ScheduleSessionModalProps) => {
  const queryClient = useQueryClient();

  const [partnerId, setPartnerId] = useState<string>(
    initialPartner?._id || (friends[0]?._id ?? ""),
  );
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(
    initialPartner?.skillToLearn || initialPartner?.skillToShare || "",
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState("");

  // get current datetime formatted for min input
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  // create session mutation
  const { mutate: createSessionMutation, isPending } = useMutation({
    mutationFn: createSessionFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studySessions"] });
      toast.success(data?.message || "Study session scheduled successfully");
      onClose();
      setTitle("");
      setNotes("");
      setScheduledDate("");
    },
    onError: handleApiError,
  });

  if (!isOpen) return null;

  // submit session handler
  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    const targetPartner = initialPartner?._id || partnerId;

    if (!targetPartner) {
      toast.error("Please select a partner scholar");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a session title");
      return;
    }
    if (!subject) {
      toast.error("Please select a study subject");
      return;
    }
    if (!scheduledDate) {
      toast.error("Please pick a date and time");
      return;
    }

    createSessionMutation({
      participantId: targetPartner,
      title: title.trim(),
      subject,
      scheduledDate,
      durationMinutes,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="card bg-base-100 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-base-300">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-primary" />
            <h3 className="font-bold text-lg">Schedule Study Session</h3>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* partner selection */}
          <div className="form-control space-y-1">
            <label className="label py-0" htmlFor="session-partner">
              <span className="label-text font-medium text-xs sm:text-sm">
                Partner Scholar
              </span>
            </label>
            {initialPartner ? (
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-base-200 border border-base-300">
                <div className="avatar size-9 rounded-lg">
                  <img
                    src={initialPartner.profileAvatar}
                    alt={initialPartner.fullName}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{initialPartner.fullName}</p>
                  <p className="text-xs opacity-60">
                    {capitalize(initialPartner.skillToShare || "General")}
                  </p>
                </div>
              </div>
            ) : (
              <select
                id="session-partner"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  -- Select Friend --
                </option>
                {friends.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.fullName} ({capitalize(f.skillToShare || "Scholar")})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* title */}
          <div className="form-control space-y-1">
            <label className="label py-0" htmlFor="session-title">
              <span className="label-text font-medium text-xs sm:text-sm">
                Session Topic or Title
              </span>
            </label>
            <input
              id="session-title"
              type="text"
              placeholder="e.g. Calculus Midterm Prep or Lab Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* subject and duration grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control space-y-1">
              <label className="label py-0" htmlFor="session-subject">
                <span className="label-text font-medium text-xs sm:text-sm">
                  Subject
                </span>
              </label>
              <select
                id="session-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  -- Select Subject --
                </option>
                {SKILLS.map((s) => (
                  <option key={s} value={s.toLowerCase()}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control space-y-1">
              <label className="label py-0" htmlFor="session-duration">
                <span className="label-text font-medium text-xs sm:text-sm flex items-center gap-1">
                  <ClockIcon className="size-3.5" />
                  Duration
                </span>
              </label>
              <select
                id="session-duration"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="select select-bordered w-full"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>

          {/* scheduled date and time */}
          <div className="form-control space-y-1">
            <label className="label py-0" htmlFor="session-datetime">
              <span className="label-text font-medium text-xs sm:text-sm">
                Date & Time
              </span>
            </label>
            <input
              id="session-datetime"
              type="datetime-local"
              min={minDateTime}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* notes */}
          <div className="form-control space-y-1">
            <label className="label py-0" htmlFor="session-notes">
              <span className="label-text font-medium text-xs sm:text-sm">
                Preparation Notes or Agenda (Optional)
              </span>
            </label>
            <textarea
              id="session-notes"
              placeholder="Key problems to solve or chapters to cover..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea textarea-bordered h-20 w-full"
            />
          </div>

          {/* modal actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm gap-1.5"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <SparklesIcon className="size-4" />
              )}
              {isPending ? "Scheduling..." : "Schedule Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleSessionModal;
