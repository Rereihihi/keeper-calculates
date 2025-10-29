import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type Calculation = {
  id: string;
  expression: string;
  result: string;
  created_at: string;
};

export const CalculatorHistory = () => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  useEffect(() => {
    fetchCalculations();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("calculations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calculations",
        },
        () => {
          fetchCalculations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCalculations = async () => {
    const { data, error } = await supabase
      .from("calculations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching calculations:", error);
    } else {
      setCalculations(data || []);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("calculations").delete().eq("id", id);

    if (error) {
      console.error("Error deleting calculation:", error);
      toast.error("ไม่สามารถลบข้อมูลได้");
    } else {
      toast.success("ลบข้อมูลแล้ว");
    }
  };

  const handleClearAll = async () => {
    const { error } = await supabase.from("calculations").delete().neq("id", "");

    if (error) {
      console.error("Error clearing calculations:", error);
      toast.error("ไม่สามารถลบข้อมูลทั้งหมดได้");
    } else {
      toast.success("ลบข้อมูลทั้งหมดแล้ว");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="glass-effect rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">ประวัติการคำนวณ</h2>
          {calculations.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              ลบทั้งหมด
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {calculations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              ยังไม่มีประวัติการคำนวณ
            </div>
          ) : (
            <div className="space-y-3">
              {calculations.map((calc) => (
                <div
                  key={calc.id}
                  className="bg-card rounded-xl p-4 hover:bg-card/80 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-muted-foreground text-sm mb-1 truncate">
                        {calc.expression}
                      </div>
                      <div className="text-foreground text-2xl font-medium">
                        = {calc.result}
                      </div>
                      <div className="text-muted-foreground text-xs mt-2">
                        {new Date(calc.created_at).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(calc.id)}
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
