import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Card { id: string; title: string; }

type ColumnKey = "ideas" | "scheduled" | "completed";

const initial: Record<ColumnKey, Card[]> = {
  ideas: [
    { id: "1", title: "Quarterly meetup in Berlin" },
    { id: "2", title: "Sales kickoff in NYC" },
  ],
  scheduled: [{ id: "3", title: "Vendor visit in London" }],
  completed: [{ id: "4", title: "Team offsite in Lisbon" }],
};

const Column = ({ title, items, onDrop }: { title: string; items: Card[]; onDrop: (id: string) => void }) => (
  <div
    className="rounded-2xl border panel-glass p-4 min-h-[280px]"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      const id = e.dataTransfer.getData("text/plain");
      onDrop(id);
    }}
  >
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="space-y-3">
      {items.map((c) => (
        <div
          key={c.id}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)}
          className="rounded-xl border bg-card/60 p-3 cursor-grab active:cursor-grabbing"
          aria-grabbed
        >
          {c.title}
        </div>
      ))}
      {items.length === 0 && <div className="text-sm text-muted-foreground">Drop here</div>}
    </div>
  </div>
);

const TripPlanner = () => {
  const [board, setBoard] = useState(initial);

  const move = (fromId: string, to: ColumnKey) => {
    let moved: Card | undefined;
    const next: Record<ColumnKey, Card[]> = { ideas: [], scheduled: [], completed: [] } as any;
    (Object.keys(board) as ColumnKey[]).forEach((k) => {
      next[k] = board[k].filter((c) => {
        if (c.id === fromId) { moved = c; return false; }
        return true;
      });
    });
    if (moved) next[to] = [...next[to], moved];
    setBoard(next);
  };

  return (
    <section id="plan" className="min-h-screen snap-start py-16 md:py-24 bg-background">
      <div className="container space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Trip planning board</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">Drag and drop trips to plan your quarter.</p>
        <div className="grid gap-6 md:grid-cols-3">
          <Column title="Ideas" items={board.ideas} onDrop={(id) => move(id, "ideas")} />
          <Column title="Scheduled" items={board.scheduled} onDrop={(id) => move(id, "scheduled")} />
          <Column title="Completed" items={board.completed} onDrop={(id) => move(id, "completed")} />
        </div>
        <div className="text-center">
          <Button variant="pill" asChild>
            <a href="/auth">Sync with calendar</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
