import moment from 'moment';
import { CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, notification, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Activation } from '../../../../services/activations/types';
import { sleep } from '../../../../utils/helpers/sleep';
import { useForm } from 'antd/lib/form/Form';
import { useLocation } from '../../../../contexts/location';
import { updateActivation } from '../../../../services/activations/updateActivation';

type FormFields = {
	description: string;
	dateRange: Date[]
}

type ActivationFormMode = 'create' | 'edit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const disabledDate = (current: any) => {
	return current && current < moment().startOf('day');
};

export const ActivationMenu = () => {
	const [activationFormOpen, setActivationFormOpen] = useState(false);
	const [activationFormMode, setActivationFormMode] = useState<ActivationFormMode>('create');
	// const [locationActivations, setLocationActivations] = useState<Activation[]>([]);
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
		(async () => {
			await sleep();
			// setLocationActivations(selectedLocation.activations);
		})();
	}, [selectedLocation]);

	const openNotification = (type: string, message: string, err?: string) => {
		if(type == 'success' || type == 'error')
			notification[type]({ message: message, description: err});
		return;
	};

	const onFinishCreate = async (values: FormFields) => {
		const isValidInterval = selectedLocation?.activations.every((activation) => {
			const startIsBetween =
				moment(values.dateRange[0]).isBetween(
					moment(activation.startDate),
					moment(activation.endDate)
				);
			const endIsBetween =
				moment(values.dateRange[1]).isBetween(
					moment(activation.startDate),
					moment(activation.endDate)
				);
			const intersects =
					moment(values.dateRange[0]).isBefore(moment(activation.startDate)) &&
					moment(values.dateRange[1]).isAfter(moment(activation.endDate));
			return startIsBetween === false && endIsBetween === false && intersects === false;
		});
		if(!isValidInterval) return createForm.setFields([
			{
				name: 'dateRange',
				errors: ['JÁ EXISTE UMA ATIVAÇÃO NESTE INTERVALO']
			}
		]);
		const requestData = {
			...selectedLocation,
			...values
		};
		try {
			await sleep(); //post
			openNotification('success', 'Dados enviados com sucesso');
			setActivationFormOpen(false);
			
			await sleep(); //get const zap = await...
			// TODO: Atualizar ativação na location
			// setLocationActivations((oldState) => {
			// 	if(!selectedLocation) throw new Error('Location not found');
			// 	return [
			// 		...oldState,
			// 		{ 
			// 			id: 3, 
			// 			locationId: selectedLocation?.id || 1, 
			// 			description: values.description, 
			// 			startDate: values.dateRange[0], 
			// 			endDate: values.dateRange[1]
			// 		}
			// 	];
			// });
			await refreshLocations();
			createForm.resetFields();
		} catch (e) {
			await sleep();
			openNotification('error', 'Houve um erro ao enviar os dados');
			setActivationFormOpen(false);
		}
	};

	const onFinishUpdate = async (values: FormFields) => {
		if(!selectedLocation || !selectedActivation) return;

		const isValidInterval = selectedLocation.activations.every((activation) => {
			if(activation.id === selectedActivation?.id) return true;
			const startIsBetween =
				moment(values.dateRange[0]).isBetween(
					moment(activation.startDate),
					moment(activation.endDate)
				);
			const endIsBetween =
				moment(values.dateRange[1]).isBetween(
					moment(activation.startDate),
					moment(activation.endDate)
				);
			const intersects =
					moment(values.dateRange[0]).isBefore(moment(activation.startDate)) &&
					moment(values.dateRange[1]).isAfter(moment(activation.endDate));
			return startIsBetween === false && endIsBetween === false && intersects === false;
		});
		if(!isValidInterval) return createForm.setFields([
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
			await refreshLocations();
			updateForm.resetFields();
		} catch (e) {
			openNotification('error', 'Houve um erro ao enviar os dados');
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
										<Button size='large' type="default" icon={<DeleteFilled />} onClick={() => console.log('deletei', selectedActivation)}>
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

