import moment from 'moment';
import { CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, notification, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Activation } from '../../../../services/activations/types';
import { sleep } from '../../../../utils/helpers/sleep';
import { useForm } from 'antd/lib/form/Form';
import { useLocation } from '../../../../contexts/location';

type FormFields = {
	description: string;
	dateRange: Date[]
}

type ActivationFormMode = 'create' | 'edit';

const testActivations = [
	{
		id: 1,
		locationId: 1,
		description: 'Ativação muito doidja',
		startDate: new Date('2022-03-17T19:30:00.000Z'),
		endDate: new Date('2022-03-17T22:30:00.000Z'),
	},
	{
		id: 2,
		locationId: 1,
		description: 'Ativação muito doidja 2: electric boogaloo',
		startDate: new Date('2022-03-19T15:30:00.000Z'),
		endDate: new Date('2022-03-20T18:30:00.000Z'),
	},
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const disabledDate = (current: any) => {
	return current && current < moment().startOf('day');
};

export const ActivationMenu = () => {
	const [activationFormOpen, setActivationFormOpen] = useState(false);
	const [activationFormMode, setActivationFormMode] = useState<ActivationFormMode>('create');
	const [locationActivations, setLocationActivations] = useState<Activation[]>(testActivations);
	const [selectedActivation, setSelectedActivation] = useState<Activation | null>();
	const [createForm] = useForm();
	const [updateForm] = useForm();

	const { selectedLocation, selectLocation } = useLocation();

	useEffect(() => {
		if (!selectedLocation) {
			selectLocation(null);
			setActivationFormOpen(false);
			return;
		}
		(async () => {
			await sleep();
			setLocationActivations(testActivations);
		})();
	}, [selectedLocation]);

	const openNotification = (type: string, message: string, err?: string) => {
		if(type == 'success' || type == 'error')
			notification[type]({ message: message, description: err});
		return;
	};

	const onFinishCreate = async (values: FormFields) => {
		const isValidInterval = locationActivations.every((activation) => {
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
			setLocationActivations((oldState) => {
				if(!selectedLocation) throw new Error('Location not found');
				return [
					...oldState,
					{ 
						id: 3, 
						locationId: selectedLocation?.id || 1, 
						description: values.description, 
						startDate: values.dateRange[0], 
						endDate: values.dateRange[1]
					}
				];
			});
			createForm.resetFields();
		} catch (e) {
			await sleep();
			openNotification('error', 'Houve um erro ao enviar os dados');
			setActivationFormOpen(false);
		}
	};

	const onFinishUpdate = async (values: FormFields) => {
		const isValidInterval = locationActivations.every((activation) => {
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
		const requestData = {
			...selectedLocation,
			...values
		};
		try {
			await sleep(); //post
			openNotification('success', 'Dados enviados com sucesso');
			setActivationFormOpen(false);
			await sleep(); //get const zap = await...
			setLocationActivations((oldState) => {
				if(!selectedLocation) throw new Error('Location not found');
				return [
					...oldState,
					{ 
						id: 3, 
						locationId: selectedLocation?.id || 1, 
						description: values.description, 
						startDate: values.dateRange[0], 
						endDate: values.dateRange[1]
					}
				];
			});
			createForm.resetFields();
		} catch (e) {
			await sleep();
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
								onChange={(e) => setSelectedActivation(e)}
								placeholder=" - "
								size='large'
								value={selectedActivation}
							>
								{locationActivations.map((activation) => {
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

