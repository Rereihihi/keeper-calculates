import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [hasResult, setHasResult] = useState(false);

  const handleNumber = (num: string) => {
    if (hasResult) {
      setDisplay(num);
      setExpression(num);
      setHasResult(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    if (hasResult) {
      setExpression(display + op);
      setHasResult(false);
    } else {
      setExpression(expression + op);
    }
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setHasResult(false);
  };

  const handleEquals = async () => {
    try {
      const fullExpression = expression || display;
      // Replace × and ÷ with * and /
      const sanitizedExpression = fullExpression.replace(/×/g, "*").replace(/÷/g, "/");
      
      // Evaluate the expression safely
      const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
      const resultStr = String(result);
      
      setDisplay(resultStr);
      setHasResult(true);
      
      // Save to Supabase
      const { error } = await supabase.from("calculations").insert({
        expression: fullExpression,
        result: resultStr,
      });

      if (error) {
        console.error("Error saving calculation:", error);
        toast.error("ไม่สามารถบันทึกการคำนวณได้");
      } else {
        toast.success("บันทึกการคำนวณแล้ว");
      }
    } catch (error) {
      setDisplay("Error");
      toast.error("การคำนวณผิดพลาด");
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setExpression(expression + ".");
    }
  };

  const handleBackspace = () => {
    if (hasResult) {
      handleClear();
    } else if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-effect rounded-3xl p-6 shadow-soft">
        {/* Display */}
        <div className="bg-calc-display rounded-2xl p-6 mb-6 min-h-[120px] flex flex-col justify-end shadow-inner">
          <div className="text-muted-foreground text-sm mb-2 h-6 overflow-hidden text-right">
            {expression}
          </div>
          <div className="text-foreground text-5xl font-light text-right break-all">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            onClick={handleClear}
            className="bg-muted hover:bg-muted/80 text-foreground h-16 text-xl font-medium rounded-2xl calc-button"
          >
            AC
          </Button>
          <Button
            onClick={handleBackspace}
            className="bg-muted hover:bg-muted/80 text-foreground h-16 text-xl font-medium rounded-2xl calc-button"
          >
            ⌫
          </Button>
          <Button
            onClick={() => handleOperator("%")}
            className="bg-calc-operator hover:bg-calc-operator-hover text-foreground h-16 text-xl font-medium rounded-2xl calc-button"
          >
            %
          </Button>
          <Button
            onClick={() => handleOperator("÷")}
            className="bg-calc-operator hover:bg-calc-operator-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button
            onClick={() => handleNumber("7")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            7
          </Button>
          <Button
            onClick={() => handleNumber("8")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            8
          </Button>
          <Button
            onClick={() => handleNumber("9")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            9
          </Button>
          <Button
            onClick={() => handleOperator("×")}
            className="bg-calc-operator hover:bg-calc-operator-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button
            onClick={() => handleNumber("4")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            4
          </Button>
          <Button
            onClick={() => handleNumber("5")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            5
          </Button>
          <Button
            onClick={() => handleNumber("6")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            6
          </Button>
          <Button
            onClick={() => handleOperator("-")}
            className="bg-calc-operator hover:bg-calc-operator-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            −
          </Button>

          {/* Row 4 */}
          <Button
            onClick={() => handleNumber("1")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            1
          </Button>
          <Button
            onClick={() => handleNumber("2")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            2
          </Button>
          <Button
            onClick={() => handleNumber("3")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            3
          </Button>
          <Button
            onClick={() => handleOperator("+")}
            className="bg-calc-operator hover:bg-calc-operator-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            onClick={() => handleNumber("0")}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button col-span-2"
          >
            0
          </Button>
          <Button
            onClick={handleDecimal}
            className="bg-calc-button hover:bg-calc-button-hover text-foreground h-16 text-2xl font-light rounded-2xl calc-button"
          >
            .
          </Button>
          <Button
            onClick={handleEquals}
            className="bg-gradient-primary hover:shadow-glow text-foreground h-16 text-2xl font-medium rounded-2xl calc-button"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
};
