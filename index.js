const eventsAPI = (function () {
  const API_URL = 'http://localhost:3000/events';

  async function getEvents() {
    return fetch(API_URL).then(res => res.json());
  }

  async function addEvent(event) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).then(res => res.json());
  }

  async function updateEvent(id, updatedEvent) {
    return fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    }).then(res => res.json());
  }

  async function deleteEvent(id) {
    return fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  }

  async function getEvent(id) {
    return fetch(`${API_URL}/${id}`).then(res => res.json());
  }

  return { getEvents, addEvent, updateEvent, deleteEvent, getEvent };
})();

class EventsModel {
  #events = [];

  setEvents(events) {
    this.#events = events;
  }

  getEvents() {
    return this.#events;
  }

  addEvent(event) {
    this.#events.push(event);
  }

  updateEvent(updatedEvent) {
    this.#events = this.#events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev);
  }

  deleteEvent(id) {
    this.#events = this.#events.filter(ev => ev.id !== id);
  }
}

class EventsView {
  constructor() {
    this.apiUrl = 'http://localhost:3000/events';
    this.tableBody = document.getElementById('event-table-body');
    this.addEventBtn = document.getElementById('add-event-btn');
    this.editStates = new Set();
    this.addEventBtn.addEventListener('click', () => this.appendAddRow());
    this.setupEventDelegation();
  }

  getTableBody() {
    return this.tableBody;
  }

  renderTable(events) {
    const newRow = document.getElementById('new-event-row');
    this.tableBody.innerHTML = '';
    events.forEach((event) => {
      const isEditing = this.editStates.has(event.id);
      const row = this.createRow(event, isEditing);
      this.tableBody.appendChild(row);
    });
    if (newRow) this.tableBody.appendChild(newRow);
  }

  createRow(event, isEditing = false) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', event.id);
    const editIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>';
    const deleteIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>';
    const saveIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>';
    const cancelIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>';

    if (isEditing) {
      tr.innerHTML = `
        <td><input type="text" class="edit-eventName" value="${event.eventName}" required></td>
        <td><input type="date" class="edit-startDate" value="${event.startDate}" required></td>
        <td><input type="date" class="edit-endDate" value="${event.endDate}" required></td>
        <td class="event-actions">
          <button class="save-btn" title="Save">${saveIcon}</button>
          <button class="cancel-btn" title="Cancel">${cancelIcon}</button>
        </td>
      `;
    } else {
      tr.innerHTML = `
        <td>${event.eventName}</td>
        <td>${event.startDate}</td>
        <td>${event.endDate}</td>
        <td class="event-actions">
          <button class="edit-btn" title="Edit">${editIcon}</button>
          <button class="delete-btn" title="Delete">${deleteIcon}</button>
        </td>
      `;
    }

    return tr;
  }

  appendAddRow() {
    if (document.getElementById('new-event-row')) return;
    const saveIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>';
    const cancelIcon = '<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>';

    const newRow = document.createElement('tr');
    newRow.id = 'new-event-row';
    newRow.innerHTML = `
      <td><input type="text" id="new-event-name" placeholder="Event Name" required></td>
      <td><input type="date" id="new-start-date" required></td>
      <td><input type="date" id="new-end-date" required></td>
      <td class="event-actions">
        <button class="save-btn" id="save-new" title="Save">${saveIcon}</button>
        <button class="cancel-btn" id="cancel-new" title="Cancel">${cancelIcon}</button>
      </td>
    `;
    this.tableBody.appendChild(newRow);
  }

  setupEventDelegation() {
    this.tableBody.addEventListener('click', async (e) => {
      const row = e.target.closest('tr');
      const eventId = row?.getAttribute('data-id');

      if (e.target.closest('#save-new')) {
        const name = document.getElementById('new-event-name').value.trim();
        const start = document.getElementById('new-start-date').value;
        const end = document.getElementById('new-end-date').value;
        if (!name || !start || !end) return alert('Please fill in all fields');
        const newEvent = await eventsAPI.addEvent({ eventName: name, startDate: start, endDate: end });
        eventsController.model.addEvent(newEvent);
        document.getElementById('new-event-row')?.remove();
        const newRow = eventsController.view.createRow(newEvent);
        eventsController.view.getTableBody().appendChild(newRow);
        for (const id of eventsController.view.editStates) {
          const row = document.querySelector(`tr[data-id="${id}"]`);
          if (row && !row.querySelector('input')) {
            const data = await eventsAPI.getEvent(id);
            const newEditRow = eventsController.view.createRow(data, true);
            row.replaceWith(newEditRow);
          }
        }
        return;
      }

      if (e.target.closest('#cancel-new')) {
        document.getElementById('new-event-row')?.remove();
        return;
      }

      if (e.target.closest('.edit-btn')) {
        eventsController.view.editStates.add(eventId);
        const event = await eventsAPI.getEvent(eventId);
        const newRow = eventsController.view.createRow(event, true);
        row.replaceWith(newRow);
        return;
      }

      if (e.target.closest('.cancel-btn')) {
        eventsController.view.editStates.delete(eventId);
        const event = await eventsAPI.getEvent(eventId);
        const restoredRow = eventsController.view.createRow(event);
        row.replaceWith(restoredRow);
        return;
      }

      if (e.target.closest('.save-btn') && !e.target.closest('#save-new')) {
        const name = row.querySelector('.edit-eventName')?.value.trim();
        const start = row.querySelector('.edit-startDate')?.value;
        const end = row.querySelector('.edit-endDate')?.value;
        if (!name || !start || !end) return alert('Please fill in all fields');
        const updatedEvent = await eventsAPI.updateEvent(eventId, { eventName: name, startDate: start, endDate: end });
        eventsController.model.updateEvent({ id: eventId, eventName: name, startDate: start, endDate: end });
        eventsController.view.editStates.delete(eventId);
        const updatedRow = eventsController.view.createRow(updatedEvent);
        row.replaceWith(updatedRow);
        return;
      }

      if (e.target.closest('.delete-btn')) {
        await eventsAPI.deleteEvent(eventId);
        eventsController.model.deleteEvent(eventId);
        eventsController.view.editStates.delete(eventId);
        row.remove();
        return;
      }
    });
  }
}

const eventsModel = new EventsModel();
const eventsView = new EventsView();
const eventsController = {
  model: eventsModel,
  view: eventsView,
  async init() {
    const events = await eventsAPI.getEvents();
    this.model.setEvents(events);
    this.view.renderTable(events);
  },
};

eventsController.init();
