-- 1) Safe creation of enum for trip status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_status') THEN
    CREATE TYPE public.trip_status AS ENUM ('requested','approved','booked','cancelled','completed');
  END IF;
END $$;

-- 2) Trips table: user-owned trips with secure RLS
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  depart_at TIMESTAMPTZ NOT NULL,
  return_at TIMESTAMPTZ NULL,
  estimated_cost INTEGER NOT NULL DEFAULT 0,
  status public.trip_status NOT NULL DEFAULT 'requested',
  itinerary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips (user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips (status);
CREATE INDEX IF NOT EXISTS idx_trips_depart_at ON public.trips (depart_at);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Trips RLS policies (owner-only access)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trips' AND policyname='Users can view their own trips') THEN
    DROP POLICY "Users can view their own trips" ON public.trips;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trips' AND policyname='Users can create their own trips') THEN
    DROP POLICY "Users can create their own trips" ON public.trips;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trips' AND policyname='Users can update their own trips') THEN
    DROP POLICY "Users can update their own trips" ON public.trips;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trips' AND policyname='Users can delete their own trips') THEN
    DROP POLICY "Users can delete their own trips" ON public.trips;
  END IF;
END $$;

CREATE POLICY "Users can view their own trips"
  ON public.trips
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips"
  ON public.trips
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips
  FOR DELETE
  USING (auth.uid() = user_id);

-- Keep trips.updated_at fresh
DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Budgets table: per-user monthly budget with secure RLS
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month DATE NOT NULL,  -- Use the first day of the month for uniqueness
  allocated INTEGER NOT NULL,
  spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, month)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON public.budgets (user_id, month);

-- Enable RLS on budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Budgets RLS policies (owner-only access)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='budgets' AND policyname='Users can view their own budgets') THEN
    DROP POLICY "Users can view their own budgets" ON public.budgets;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='budgets' AND policyname='Users can create their own budgets') THEN
    DROP POLICY "Users can create their own budgets" ON public.budgets;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='budgets' AND policyname='Users can update their own budgets') THEN
    DROP POLICY "Users can update their own budgets" ON public.budgets;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='budgets' AND policyname='Users can delete their own budgets') THEN
    DROP POLICY "Users can delete their own budgets" ON public.budgets;
  END IF;
END $$;

CREATE POLICY "Users can view their own budgets"
  ON public.budgets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets"
  ON public.budgets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON public.budgets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON public.budgets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Keep budgets.updated_at fresh
DROP TRIGGER IF EXISTS update_budgets_updated_at ON public.budgets;
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();