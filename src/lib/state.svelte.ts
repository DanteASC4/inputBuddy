import type { Answer, AppState, Settings } from "@types";
import {
  deleteAnswer,
  deleteProfile,
  getAnswerProfiles,
  getAnswers,
  getLastProfile,
  getSettings,
  saveNewProfile,
  setLastProfile,
  updateSettings,
  upsertAnswer,
} from "@u/storage";
import { infoLog } from "@u/styled-log";

export const Appstate = $state({
  answers: [] as Answer[],
  profiles: [] as string[],
  settings: {
    enabled: true,
    autoFillEnabled: true,
    floatingMenuEnabled: true,
    matchMode: "partial",
    fontStyle: "serif",
    keepOpen: false,
    debug: true,
    indicateFilled: true,
  } satisfies Settings,
  isSaving: false,
  saveError: "",
  currentProfile: "default",
  async loadAnswers(profile?: string) {
    this.answers = await getAnswers(profile ?? this.currentProfile);
  },
  async loadSettings() {
    this.settings = await getSettings();
  },
  async loadProfiles() {
    this.profiles = await getAnswerProfiles();
  },
  async loadLastProfile() {
    const lastProfile = await getLastProfile();
    if (lastProfile && this.profiles.includes(lastProfile)) {
      await this.switchProfile(lastProfile);
    } else {
      await this.switchProfile("default");
    }
  },
  async init() {
    await Promise.all([
      this.loadAnswers(),
      this.loadSettings(),
      this.loadProfiles(),
      this.loadLastProfile(),
    ]);
    return true;
  },
  async saveAnswer(label: string, value: string, id?: string) {
    if (!label.trim() || !value.trim()) return;
    this.isSaving = true;
    this.saveError = "";

    try {
      this.answers = await upsertAnswer(this.currentProfile, label, value, id);
    } catch (error) {
      console.error("Failed to save answer.", error);
      this.saveError = "Something went wrong while saving.";
    } finally {
      this.isSaving = false;
    }
  },
  async removeAnswer(id: string) {
    this.isSaving = true;
    this.saveError = "";

    try {
      this.answers = await deleteAnswer(this.currentProfile, id);
    } catch (error) {
      console.error("Failed to remove answer.", error);
      this.saveError = "Something went wrong while removing.";
    } finally {
      this.isSaving = false;
    }
  },
  async changeSettings(settings: Partial<AppState["settings"]>) {
    this.isSaving = true;
    this.saveError = "";

    try {
      this.settings = await updateSettings(settings);
    } catch (error) {
      console.error("Failed to update settings.", error);
      this.saveError = "Something went wrong while updating settings.";
    } finally {
      this.isSaving = false;
    }
  },
  async switchProfile(profile: string) {
    infoLog(`Switching from profile: ${this.currentProfile} to ${profile}`);
    this.currentProfile = profile;
    await this.loadAnswers(profile);
    await setLastProfile(profile);
  },
  async switchsertProfile(profile: string) {
    if (this.profiles.includes(profile)) {
      await this.switchProfile(profile);
    } else {
      try {
        const saved = await saveNewProfile(profile);
        this.profiles = saved;
        await this.switchProfile(profile);
      } catch (err) {
        console.error(err);
      }
    }
  },
  async delProfile(profile: string) {
    if (!this.profiles.includes(profile)) return;
    if (profile === "default") {
      console.warn("Default profile cannot be deleted.");
      return;
    }

    try {
      const newProfiles = await deleteProfile(profile);
      this.profiles = newProfiles;
      if (this.currentProfile === profile) {
        await this.switchProfile("default");
      }
    } catch (err) {
      console.error(err);
    }
  },
} satisfies AppState);
