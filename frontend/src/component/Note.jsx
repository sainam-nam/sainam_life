import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { CirclePlus, Pin, PinOff, Trash2 } from 'lucide-react';

export default function NotesSidebar() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    const loadNotes = async () => {
        const res = await fetch('http://localhost:5000/notes');
        const data = await res.json();
        setNotes(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect   
        loadNotes();
    }, []);

    // CREATE
    const addNote = async () => {
        if (!newNote) return;

        await fetch('http://localhost:5000/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newNote, content: '' })
        });

        setNewNote('');
        loadNotes();
    };

    // PIN
    const togglePin = async (note) => {
        await fetch(`http://localhost:5000/note/${note.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...note,
                is_pinned: note.is_pinned ? 0 : 1
            })
        });

        loadNotes();
    };

    //DRAG
    const onDragEnd = async (result) => {
        if (!result.destination) return;
        console.log('first');
        const items = Array.from(notes);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        setNotes(items);
        console.log('items', items);
        console.log(
            items.map((n, index) => ({
                id: n.id,
                position: index
            }))
        );
        await fetch('http://localhost:5000/notes/reorder', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notes: items.map((n, index) => ({
                    id: n.id,
                    position: index
                }))
            })
        });
    };

    // DELETE
    const deleteNote = async (id) => {
        await fetch(`http://localhost:5000/notes/${id}`, {
            method: 'DELETE'
        });

        loadNotes();
    };

    return (
        <div className="w-72 m-4 p-4 rounded-3xl backdrop-blur-xl bg-yellow-100/60 dark:bg-yellow-900/30 shadow-xl border border-white/30 flex flex-col">
            <h2 className="font-bold mb-3">📝 Notes</h2>
            <div className="flex gap-2 mb-3">
                <input
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="New note..."
                    className="flex-1 px-2 py-1 rounded bg-white/60"
                />
                <button
                    onClick={addNote}
                    className="p-2 bg-yellow-400 rounded text-white"
                ><CirclePlus /></button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="notes">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-3 overflow-y-auto overflow-x-visible"
                        >
                            {notes.map((note, index) => (
                                <Draggable
                                    key={note.id}
                                    draggableId={note.id.toString()}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                zIndex: snapshot.isDragging ? 9999 : 'auto'
                                            }}
                                            className={`p-5 rounded-xl shadow-md relative transition cursor-grab
                                                ${snapshot.isDragging
                                                    ? 'bg-yellow-300 scale-105 z-50 shadow-2xl'
                                                    : note.is_pinned
                                                        ? 'bg-yellow-200 dark:bg-yellow-700'
                                                        : 'bg-white/70 dark:bg-gray-700'}
                                            `}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="absolute top-2 mb-1 left-3 cursor-grab text-base opacity-40"
                                            > ☰ </div>
                                            <button
                                                onClick={() => togglePin(note)}
                                                className="absolute top-2 mb-1 right-3 text-gray-500"
                                            >
                                                {note.is_pinned ? <PinOff size={20}/> : <Pin size={20}/>}
                                            </button>
                                            <input
                                                value={note.title}
                                                onChange={async (e) => {
                                                    const updated = { ...note, title: e.target.value };

                                                    await fetch(`http://localhost:5000/notes/${note.id}`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(updated)
                                                    });

                                                    loadNotes();
                                                }}
                                                className="w-full bg-transparent font-semibold mt-5 px-2 rounded-lg border border-gray"
                                            />
                                            <textarea
                                                value={note.content || ''}
                                                onChange={async (e) => {
                                                    const updated = { ...note, content: e.target.value };

                                                    await fetch(`http://localhost:5000/notes/${note.id}`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(updated)
                                                    });

                                                    loadNotes();
                                                }}
                                                className="w-full bg-transparent text-sm mt-1 mb-5 px-2 rounded-lg border border-gray"
                                            />
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="absolute bottom-3 right-3 text-xs text-white bg-red-400 p-1 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}