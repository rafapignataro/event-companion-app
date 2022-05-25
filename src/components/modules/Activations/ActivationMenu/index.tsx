import moment from 'moment';
import { CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, notification, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Activation } from '../../../../services/activations/types';
import { useForm } from 'antd/lib/form/Form';
import { useLocation } from '../../../../contexts/location';
import { updateActivation } from '../../../../services/activations/updateActivation';
import { createActivation } from '../../../../services/activations/createActivation';
import { deleteActivation } from '../../../../services/activations/deleteActivation';

type FormFields = {
	description: string;
	dateRange: Date[]
}

type ActivationFormMode = 'create' | 'edit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const disabledDate = (current: any) => {
	return current && current < moment().startOf('day');
};

const validateSelectedDateRange = (activations: Activation[], startDate: Date, endDate: Date) => {
	return activations.every((activation) => {
		const startIsBetween =
			moment(startDate).isBetween(
				moment(activation.startDate),
				moment(activation.endDate)
			);
		const endIsBetween =
			moment(endDate).isBetween(
				moment(activation.startDate),
				moment(activation.endDate)
			);
		const intersects =
				moment(startDate).isBefore(moment(activation.startDate)) &&
				moment(endDate).isAfter(moment(activation.endDate));

		return startIsBetween === false && endIsBetween === false && intersects === false;
	});
};

export const ActivationMenu = () => {
	const [activationFormOpen, setActivationFormOpen] = useState(false);
	const [activationFormMode, setActivationFormMode] = useState<ActivationFormMode>('create');
	const [selectedActivation, setSelectedActivation] = useState<Activation | null>();
	const [createForm] = useForm();
	const [updateForm] = useForm();

	const { selectedLocation, selectLocation, refreshLocations } = useLocation();

	useEffect(() => {
		if (!selectedLocation) {
			selectLocation(null);
			setActivationFormOpen(false);
			return;
		}
	}, [selectedLocation]);

	useEffect(() => {
		if(!selectedActivation) return;

		updateForm.setFieldsValue({
			...selectedActivation,
			dateRange: [moment(selectedActivation.startDate), moment(selectedActivation.endDate)]
		});
	}, [selectedActivation]);

	const openNotification = (type: string, message: string, err?: string) => {
		if(type == 'success' || type == 'error')
			notification[type]({ message: message, description: err});
		return;
	};

	const onFinishCreate = async (values: FormFields) => {
		if(!selectedLocation) return;

		const isValidInterval = validateSelectedDateRange(
			selectedLocation.activations, 
			values.dateRange[0], 
			values.dateRange[1]
		);

		if (!isValidInterval) return createForm.setFields([
			{
				name: 'dateRange',
				errors: ['JÁ EXISTE UMA ATIVAÇÃO NESTE INTERVALO']
			}
		]);

		try {
			console.log({
				locationId: selectedLocation.id, 
				description: values.description, 
				startDate: values.dateRange[0], 
				endDate: values.dateRange[1]
			});
			await createActivation({
				locationId: selectedLocation.id, 
				description: values.description, 
				startDate: values.dateRange[0], 
				endDate: values.dateRange[1]
			});

			openNotification('success', 'Dados enviados com sucesso');
			setActivationFormOpen(false);
			selectLocation(null);
			updateForm.resetFields();

			await refreshLocations();
		} catch (e) {
			openNotification('error', 'Houve um erro ao enviar os dados');
			setActivationFormOpen(false);
		}
	};

	const onFinishUpdate = async (values: FormFields) => {
		console.log(123);
		if(!selectedLocation || !selectedActivation) return;

		const isValidInterval = validateSelectedDateRange(
			selectedLocation.activations, 
			values.dateRange[0], 
			values.dateRange[1]
		);

		if (!isValidInterval) return createForm.setFields([
			{
				name: 'dateRange',
				errors: ['JÁ EXISTE UMA ATIVAÇÃO NESTE INTERVALO']
			}
		]);

		try {
			await updateActivation({
				id: selectedActivation.id,
				data: {
					locationId: selectedLocation.id, 
					description: values.description, 
					startDate: values.dateRange[0], 
					endDate: values.dateRange[1]
				}
			});

			openNotification('success', 'Dados enviados com sucesso');
			setActivationFormOpen(false);
			selectLocation(null);
			setSelectedActivation(null);
			updateForm.resetFields();

			await refreshLocations();
		} catch (e) {
			openNotification('error', 'Houve um erro ao enviar os dados');
			setActivationFormOpen(false);
		}
	};

	const onDeleteActivation = async (id: number) => {
		try {
			await deleteActivation({ id });

			openNotification('success', 'Ativação deletada com sucesso!');
			setActivationFormOpen(false);
			selectLocation(null);
			setSelectedActivation(null);
			updateForm.resetFields();

			await refreshLocations();
		} catch (e) {
			openNotification('error', 'Houve um erro ao deletar a ativação.');
			setActivationFormOpen(false);
		}
	};

	return (
		<>
			{activationFormOpen ? (
				<>
					{activationFormMode === 'create' ? (
						<Form
							name="createForm"
							onFinish={onFinishCreate}
							autoComplete="off"
							labelCol={{ span: 24 }}
							form={createForm}
						>
							<Form.Item
								label="DESCRIÇÃO"
								name="description"
								rules={[{ required: true, message: 'INSIRA UMA DESCRIÇÃO' }]}
							>
								<Input.TextArea 
									placeholder=' - '
									showCount maxLength={255}
									style={{ height: 120 }}
									autoSize={{ minRows: 3, maxRows: 5 }}
									size='large'
								/>
							</Form.Item>

							<Form.Item
								label="DATA E HORA DE EXIBIÇÃO"
								name="dateRange"
								rules={[{ required: true, message: 'INSIRA UM HORÁRIO PARA A EXIBIÇÃO' }]}
							>
								<DatePicker.RangePicker
									showTime={{ format: 'HH:mm' }}
									disabledDate={disabledDate}			
									placeholder={['Start Time', 'End Time']}
									format="DD/MM/YYYY - HH:mm"
									size='large'
								/>
							</Form.Item>

							<Form.Item>
								<Button size='large' type="primary" icon={<CheckOutlined />} htmlType="submit">
									Salvar
								</Button>
							</Form.Item>

							<Form.Item>
								<Button size='large' type="default" icon={<CloseOutlined />} onClick={() => {
									selectLocation(null);
									setActivationFormOpen(false);
								}}>
									Cancelar
								</Button>
							</Form.Item>
						</Form>
					) : (
						<>
							<Select
								onChange={(e) => setSelectedActivation(selectedLocation?.activations.find(activation => activation.id === e))}
								placeholder=" - "
								size='large'
								value={selectedActivation?.id}
							>
								{selectedLocation?.activations.map((activation) => {
									return (
										<Select.Option 
											key={activation.id} 
											value={activation.id}
										>
											{moment(activation.startDate).utc().format('DD/MM/YYYY - HH:mm')} até {moment(activation.endDate).utc().format('DD/MM/YYYY - HH:mm')}
										</Select.Option>
									);
								})}
							</Select>
							{selectedActivation ? (
								<Form
									name="updateForm"
									onFinish={onFinishUpdate}
									autoComplete="off"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
									form={updateForm}
									initialValues={{ 
										...selectedActivation,
										dateRange: [moment(selectedActivation.startDate), moment(selectedActivation.endDate)]
									}}
								>
									<Form.Item
										label="DESCRIÇÃO"
										name="description"
										rules={[{ required: true, message: 'INSIRA UMA DESCRIÇÃO' }]}
									>
										<Input.TextArea 
											placeholder=' - '
											showCount maxLength={255}
											style={{ height: 120 }}
											autoSize={{ minRows: 3, maxRows: 5 }}
											size='large'
										/>
									</Form.Item>

									<Form.Item
										label="DATA E HORA DE EXIBIÇÃO"
										name="dateRange"
										rules={[{ required: true, message: 'INSIRA UM HORÁRIO PARA A EXIBIÇÃO' }]}
									>
										<DatePicker.RangePicker
											showTime={{ format: 'HH:mm' }}
											disabledDate={disabledDate}			
											placeholder={['Start Time', 'End Time']}
											format="DD/MM/YYYY - HH:mm"
											size='large'
										/>
									</Form.Item>

									<Form.Item>
										<Button size='large' type="primary" icon={<CheckOutlined />} htmlType="submit">
											Salvar
										</Button>
									</Form.Item>

									<Form.Item>
										<Button size='large' type="default" icon={<DeleteFilled />} onClick={() => onDeleteActivation(selectedActivation.id)}>
											Deletar
										</Button>
									</Form.Item>

									<Form.Item>
										<Button size='large' type="default" icon={<CloseOutlined />} onClick={() => {
											setSelectedActivation(null);
										}}>
											Cancelar
										</Button>
									</Form.Item>
								</Form>
							) : (
								<Button size='large' type="default" icon={<CloseOutlined />} onClick={() => {
									setSelectedActivation(null);
									selectLocation(null);
									setActivationFormOpen(false);
								}}>
									Cancelar
								</Button>
							)}
						</>
					)}
				</>
			) : (
				<>
					<Button 
						style={{ marginBottom: '1em' }}
						disabled={!selectedLocation}
						size='large'
						onClick={() => {
							setActivationFormMode('create');
							setActivationFormOpen(true);
						}}
					>Criar uma nova ativação</Button>
					<Button 
						style={{ marginBottom: '1em' }}
						disabled={!selectedLocation}
						size='large'
						onClick={() => {
							setActivationFormMode('edit');
							setActivationFormOpen(true);
						}}
					>Editar ativações</Button>
					<Typography.Title 
						level={4} 
						style={{ textAlign: 'center', margin: '1em 0' }}
					>
						SELECIONE UM LOCAL
					</Typography.Title>
				</>
			)}
		</>
	);
};

