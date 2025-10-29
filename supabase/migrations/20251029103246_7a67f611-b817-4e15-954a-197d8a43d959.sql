-- Create calculations table to store calculator history
CREATE TABLE IF NOT EXISTS public.calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read calculations
CREATE POLICY "Anyone can view calculations"
  ON public.calculations
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert calculations
CREATE POLICY "Anyone can insert calculations"
  ON public.calculations
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to delete calculations
CREATE POLICY "Anyone can delete calculations"
  ON public.calculations
  FOR DELETE
  USING (true);

-- Enable realtime for calculations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.calculations;

-- Create index for faster queries
CREATE INDEX idx_calculations_created_at ON public.calculations(created_at DESC);