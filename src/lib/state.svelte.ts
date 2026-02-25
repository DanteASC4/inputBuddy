import { AppState } from '@types';
import {
  deleteAnswer,
  getAnswers,
  getSettings,
  updateSettings,
  upsertAnswer,
} from '@u/storage';

export const Appstate = $state<AppState>({
  answers: [],
  settings: {
    enabled: true,
    matchMode: 'partial',
  },
  isSaving: false,
  saveError: '',
  async loadAnswers() {
    this.answers = await getAnswers();
  },
  async loadSettings() {
    this.settings = await getSettings();
  },
  async init() {
    await Promise.all([this.loadAnswers(), this.loadSettings()]);
  },
  async saveAnswer(label: string, value: string) {
    if (!label.trim() || !value.trim()) return;
    this.isSaving = true;
    this.saveError = '';

    try {
      this.answers = await upsertAnswer(label, value);
    } catch (error) {
      console.error('Failed to save answer.', error);
      this.saveError = 'Something went wrong while saving.';
    } finally {
      this.isSaving = false;
    }
  },
  async removeAnswer(id: string) {
    this.isSaving = true;
    this.saveError = '';

    try {
      this.answers = await deleteAnswer(id);
    } catch (error) {
      console.error('Failed to remove answer.', error);
      this.saveError = 'Something went wrong while removing.';
    } finally {
      this.isSaving = false;
    }
  },
  async changeSettings(settings: Partial<AppState['settings']>) {
    this.isSaving = true;
    this.saveError = '';

    try {
      this.settings = await updateSettings(settings);
    } catch (error) {
      console.error('Failed to update settings.', error);
      this.saveError = 'Something went wrong while updating settings.';
    } finally {
      this.isSaving = false;
    }
  },
});
