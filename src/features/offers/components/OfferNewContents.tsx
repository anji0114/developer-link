'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useToast } from '@/components/functional/ToastProvider';
import { Loading } from '@/components/ui/Loading';
import { OfferForm } from '@/features/offers/components/OfferForm';
import { createOffer } from '@/features/offers/services/createOffer';
import { useProjectsMine } from '@/hooks/api/useProjectsMine';
import { offerFormSchema, type OfferFormType } from '@/types/schema/offerForm';

export const OfferNewContents = () => {
  const router = useRouter();
  const { openToast } = useToast();
  const formMethods = useForm<OfferFormType>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      contents: '',
      project_id: '',
    },
  });
  const { data: projects, isLoading } = useProjectsMine();

  const onSubmit = async (data: OfferFormType) => {
    await createOffer(data);
    openToast({
      children: '募集を作成しました',
    });
    router.push(`/dashboard/offers`);
  };

  if (isLoading || !projects) return <Loading type='absolute' />;
  if (projects.length === 0) return <div>プロジェクトがありません</div>;

  return (
    <FormProvider {...formMethods}>
      <OfferForm
        projects={projects}
        disabled={formMethods.formState.isValid}
        isLoading={isLoading}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        submitText='公開'
      />
    </FormProvider>
  );
};
