export type UnsavedEntry = {
  title: string;
  notes: string;
  photoUrl: string;
};
export type Entry = UnsavedEntry & {
  entryId: number;
};

export async function readEntries(): Promise<Entry[]> {
  const req = await fetch('/api/entries');
  const parsedResponse = await req.json();
  return parsedResponse;
}

export async function addEntry(entry: UnsavedEntry): Promise<Entry> {
  const req = await fetch('/api/entries', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  const responseEntry = await req.json();
  console.log('response', responseEntry);
  return responseEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  console.log(entry);
  const req = await fetch(`/api/entries/${entry.entryId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  const response = await req.json();
  return response;
}

export async function removeEntry(entryId: number): Promise<void> {
  const req = await fetch(`/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  });
  const parsedResponse = await req.json();
  return parsedResponse;
}
