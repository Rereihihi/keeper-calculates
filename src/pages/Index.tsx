import { Calculator } from "@/components/Calculator";
import { CalculatorHistory } from "@/components/CalculatorHistory";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-2 bg-gradient-primary bg-clip-text text-transparent">
            เครื่องคิดเลข
          </h1>
          <p className="text-muted-foreground text-lg">
            คำนวณและบันทึกผลลัพธ์อัตโนมัติ
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Calculator />
          <CalculatorHistory />
        </div>
      </div>
    </div>
  );
};

export default Index;
