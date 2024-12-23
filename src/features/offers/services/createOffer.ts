'use server';

import { revalidatePath } from 'next/cache';
import type { OfferFormType } from '@/types/schema/offerForm';
import { createSupabaseServer } from '@/utils/supabase/server';

export const createOffer = async (formValue: OfferFormType) => {
  const supabase = createSupabaseServer();

  const { error, data } = await supabase
    .from('offers')
    .insert({
      title: formValue.title,
      contents: formValue.contents,
      project_id: formValue.project_id,
    })
    .select('*')
    .single();

  if (error) {
    return { error: error.message };
  }
  revalidatePath('/dashboard/offers');

  return { data: data };
};
