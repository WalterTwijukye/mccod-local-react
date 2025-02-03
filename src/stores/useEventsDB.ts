import Dexie from 'dexie';
import { FormData } from '../types/FormData';

// Define the structure of the event DB
class EventDB extends Dexie {
  events: Dexie.Table<FormData, number>; // Define types of the "events" table

  constructor() {
    super('EventDB'); // DB name changed to EventDB
    this.version(1).stores({
      events: '++id, MOH_National_Case_Number, Name, syncStatus, facility', // Indexes
    });
    this.events = this.table('events');
  }
}

const db = new EventDB();

export const addEvent = async (data: FormData) => {
  try {
    const eventWithSyncStatus: FormData = { ...data, syncStatus: 'pending' };
    const id = await db.events.add(eventWithSyncStatus); // Save event data
    return id;
  } catch (error) {
    console.error('Failed to add event data:', error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    await db.events.delete(id); // Delete event by ID
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};


export const getEventData = async () => {
  try {
    return await db.events.toArray(); // Get all event data
  } catch (error) {
    console.error('Failed to get event data:', error);
    throw error;
  }
};

export const updateSyncStatus = async (id: number, status: 'pending' | 'synced') => {
  try {
    await db.events.update(id, { syncStatus: status });
  } catch (error) {
    console.error('Failed to update sync status:', error);
    throw error;
  }
};

export const clearEventData = async () => {
  try {
    await db.events.clear(); // Clear event data
  } catch (error) {
    console.error('Failed to clear event data:', error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const events = await db.events.toArray();
    const total = events.length;
    const sent = events.filter((event) => event.syncStatus === 'synced').length;
    const notSent = events.filter((event) => event.syncStatus === 'pending').length;

    return { total, sent, notSent };
  } catch (error) {
    console.error('Failed to get stats:', error);
    throw error;
  }
};


export default db;
