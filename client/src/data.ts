export type UnsavedEntry = {
  title: string;
  notes: string;
  photoUrl: string;
};
export type Entry = UnsavedEntry & {
  entryId: number;
};

let data = {
  entries: [] as Entry[],
  nextEntryId: 1,
};

window.addEventListener('beforeunload', function () {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('code-journal-data', dataJSON);
});

const localData = localStorage.getItem('code-journal-data');
if (localData) {
  data = JSON.parse(localData);
}

export async function readEntries(): Promise<Entry[]> {
    const req = await fetch('/api/entries');
    const parsedResponse = await req.json();
    return parsedResponse
}

export async function addEntry(entry: UnsavedEntry): Promise<Entry>{
  const req = await fetch('/api/entries', {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
  const responseEntry = await req.json()
  console.log("response", responseEntry)
  return responseEntry;
}

export async function updateEntry(entry: Entry): Entry {
  console.log(entry)
  const req = await fetch(`/api/entries/${entry.entryId}`, {
    method: "PUT",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
  const response = await req.json()
  return response;
}

export function removeEntry(entryId: number): void {
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
}
